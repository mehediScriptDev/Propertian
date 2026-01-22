'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import axios from '@/lib/axios';
import { Bell, Clock, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import ConciergeRequestsFilters from '@/components/dashboard/admin/ConciergeRequestsFilters';
import ConciergeTicketsTable from '@/components/dashboard/admin/ConciergeTicketsTable';
import Pagination from '@/components/dashboard/Pagination';
import AssignModal from '@/components/dashboard/admin/AssignModal';
import ViewTicketModal from '@/components/dashboard/admin/ViewTicketModal';
import ConfirmCloseModal from '@/components/dashboard/admin/ConfirmCloseModal';

export default function ConciergeRequestsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

  // State for tickets from API
  const [ticketsData, setTicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTicket, setAssignTicket] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeTicket, setCloseTicket] = useState(null);

  // Fetch tickets from API
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (assignedFilter && assignedFilter !== 'all') {
        params.append('assignedTo', assignedFilter);
      }

      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      // Add sorting
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await axios.get(`/concierge/tickets?${params.toString()}`);

      if (response.data.success) {
        setTicketsData(response.data.data || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTicketsData([]);
      setPagination({
        total: 0,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter, assignedFilter, searchTerm]);

  
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = ticketsData;

  // Calculate stats from current page data
  const stats = useMemo(() => {
    const total = pagination.total;
    const pending = ticketsData.filter((t) => t.status === 'pending').length;
    const assigned = ticketsData.filter((t) => t.assigned_to !== 'unassigned').length;

    // Completed today (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const completedToday = ticketsData.filter(
      (t) => t.status === 'completed' && new Date(t.created_at) > oneDayAgo
    ).length;

    return { total, pending, assigned, completedToday };
  }, [ticketsData, pagination.total]);

  // Server-side pagination - no need to slice data
  const paginatedTickets = filteredTickets;
  const totalPages = pagination.totalPages;

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleAssignedChange = useCallback((value) => {
    setAssignedFilter(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  // Action handlers
  const handleView = useCallback((ticket) => {
    setViewTicket(ticket);
    setViewModalOpen(true);
  }, []);

  const handleAssign = useCallback((ticket) => {
    setAssignTicket(ticket);
    setAssignModalOpen(true);
  }, []);

  const handleClose = useCallback((ticket) => {
    setCloseTicket(ticket);
    setCloseModalOpen(true);
  }, []);

  // Modal handlers
  const handleAssignConfirm = useCallback(async (assignType) => {
    if (!assignTicket) return;

    try {
      // Update ticket via API
      await axios.put(`/concierge/tickets/${assignTicket.id}`, {
        assigned_to: assignType,
        status: 'assigned'
      });

      // Refresh tickets from server
      await fetchTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert('Failed to assign ticket');
    }

    setAssignModalOpen(false);
    setAssignTicket(null);
  }, [assignTicket, fetchTickets]);

  const handleCloseConfirm = useCallback(async () => {
    if (!closeTicket) return;

    try {
      // Delete ticket via API
      await axios.delete(`/concierge/tickets/${closeTicket.id}`);

      // Refresh tickets from server
      await fetchTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Failed to close ticket');
    }

    setCloseModalOpen(false);
    setCloseTicket(null);
  }, [closeTicket, fetchTickets]);

  // Translations
  const conciergeTranslations = useMemo(
    () => ({
      title: 'Concierge Tickets',
      subtitle: 'Manage and track concierge service tickets',
      searchPlaceholder: 'Search by ticket ID, user name, email, or service type...',
      filters: {
        allStatus: 'All Status',
        allAssigned: 'All Assignments',
        internal: 'Internal',
        partner: 'Partner',
        unassigned: t('dashboard.admin.conciergeRequests.filters.unassigned') || 'Unassigned',
      },
      status: {
        pending: 'Pending',
        assigned: 'Assigned',
        inProgress: 'In Progress',
        infoRequested: 'Info Requested',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      table: {
        ticketId: 'Ticket ID',
        userName: 'User Name',
        serviceType: 'Service Type',
        status: 'Status',
        assignedTo: 'Assigned To',
        createdAt: 'Created At',
        priority: 'Priority',
        actions: 'Actions',
        view: 'View',
        assign: 'Assign',
        close: 'Close',
      },
    }),
    [t]
  );

  const statsTranslations = useMemo(
    () => ({
      totalTickets: 'Total Tickets',
      pending: 'Pending',
      assigned: 'Assigned',
      completed: 'Completed Today',
    }),
    [t]
  );

  const paginationTranslations = useMemo(
    () => ({
      showing: t('common.showing'),
      to: t('common.to'),
      of: t('common.of'),
      results: t('common.results'),
      previous: t('common.previous'),
      next: t('common.next'),
    }),
    [t]
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900'>
          {conciergeTranslations.title}
        </h1>
        <p className='text-sm sm:text-base text-gray-700 mt-2'>
          {conciergeTranslations.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title={statsTranslations.totalTickets}
          value={stats.total}
          icon={Bell}
          trend='+12%'
          trendLabel='vs last month'
        />
        <StatsCard
          title={statsTranslations.pending}
          value={stats.pending}
          icon={Clock}
          trend='+5%'
          trendLabel='vs last week'
        />
        <StatsCard
          title={statsTranslations.assigned}
          value={stats.assigned}
          icon={UserPlus}
          trend='+8%'
          trendLabel='active now'
        />
        <StatsCard
          title={statsTranslations.completed}
          value={stats.completedToday}
          icon={CheckCircle}
          trend='+15%'
          trendLabel='vs yesterday'
        />
      </div>

      {/* Filters */}
      <ConciergeRequestsFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        assignedFilter={assignedFilter}
        onAssignedChange={handleAssignedChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        translations={conciergeTranslations}
      />

      {/* Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <ConciergeTicketsTable
          tickets={paginatedTickets}
          translations={conciergeTranslations}
          onView={handleView}
          onAssign={handleAssign}
          onClose={handleClose}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          showItemsPerPage={true}
          translations={paginationTranslations}
        />
      </div>

      {/* Modals */}
      <ViewTicketModal
        open={viewModalOpen}
        ticket={viewTicket}
        onClose={() => setViewModalOpen(false)}
      />
      <AssignModal
        open={assignModalOpen}
        ticket={assignTicket}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAssignConfirm}
      />
      <ConfirmCloseModal
        open={closeModalOpen}
        ticket={closeTicket}
        onClose={() => setCloseModalOpen(false)}
        onConfirm={handleCloseConfirm}
      />
    </div>
  );
}
