'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Bell, Clock, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import ConciergeRequestsFilters from '@/components/dashboard/admin/ConciergeRequestsFilters';
import ConciergeTicketsTable from '@/components/dashboard/admin/ConciergeTicketsTable';
import Pagination from '@/components/dashboard/Pagination';
import AssignModal from '@/components/dashboard/admin/AssignModal';
import ViewTicketModal from '@/components/dashboard/admin/ViewTicketModal';
import ConfirmCloseModal from '@/components/dashboard/admin/ConfirmCloseModal';

// Service types for concierge tickets
const SERVICE_TYPES = [
  'Airport Pickup',
  'Relocation Assistance',
  'Document Translation',
  'Legal Assistance',
  'Property Viewing',
  'Utility Setup',
  'Property Maintenance',
  'Interior Design',
  'Cleaning Services',
  'Security Installation',
  'Rental Agreement Support',
  'Property Insurance',
];

// Mock ticket data for the redesigned page
const MOCK_TICKETS = [
  {
    id: 'cmid03abc123',
    user_name: 'John Anderson',
    user_email: 'john.anderson@email.com',
    user_phone: '+1 234 567 8900',
    service_type: 'Airport Pickup',
    status: 'pending',
    assigned_to: 'unassigned',
    created_at: '2026-01-10T08:30:00Z',
    priority: 'high',
    property_address: '123 Main Street, Downtown, NY 10001',
    description: 'Need airport pickup service from JFK to Manhattan apartment. Flight arrives at 3:30 PM on Jan 15th.',
    image_url: null,
  },
  {
    id: 'cmid04xyz789',
    user_name: 'Sarah Miller',
    user_email: 'sarah.miller@email.com',
    user_phone: '+1 234 567 8901',
    service_type: 'Relocation Assistance',
    status: 'assigned',
    assigned_to: 'internal',
    created_at: '2026-01-09T14:20:00Z',
    priority: 'medium',
    property_address: '456 Park Avenue, Midtown, NY 10022',
    description: 'Moving from Chicago to New York. Need help with furniture delivery and setup.',
    image_url: null,
  },
  {
    id: 'cmid05def456',
    user_name: 'Michael Chen',
    user_email: 'michael.chen@email.com',
    user_phone: '+1 234 567 8902',
    service_type: 'Document Translation',
    status: 'in-progress',
    assigned_to: 'partner',
    created_at: '2026-01-08T10:15:00Z',
    priority: 'low',
    property_address: '789 Broadway, SoHo, NY 10003',
    description: 'Need lease agreement translated from English to Mandarin Chinese.',
    image_url: null,
  },
  {
    id: 'cmid06ghi789',
    user_name: 'Emily Rodriguez',
    user_email: 'emily.rodriguez@email.com',
    user_phone: '+1 234 567 8903',
    service_type: 'Legal Assistance',
    status: 'info-requested',
    assigned_to: 'internal',
    created_at: '2026-01-07T16:45:00Z',
    priority: 'high',
    property_address: '321 5th Avenue, Manhattan, NY 10016',
    description: 'Review rental contract before signing. Need legal consultation.',
    image_url: null,
  },
  {
    id: 'cmid07jkl012',
    user_name: 'David Thompson',
    user_email: 'david.thompson@email.com',
    user_phone: '+1 234 567 8904',
    service_type: 'Property Viewing',
    status: 'completed',
    assigned_to: 'partner',
    created_at: '2026-01-05T09:00:00Z',
    priority: 'medium',
    property_address: '654 West End Avenue, Upper West Side, NY 10025',
    description: 'Property viewing completed successfully on Jan 6th.',
    image_url: null,
  },
  {
    id: 'cmid08mno345',
    user_name: 'Lisa Wang',
    user_email: 'lisa.wang@email.com',
    user_phone: '+1 234 567 8905',
    service_type: 'Utility Setup',
    status: 'pending',
    assigned_to: 'unassigned',
    created_at: '2026-01-11T11:30:00Z',
    priority: 'medium',
    property_address: '987 Lexington Avenue, Upper East Side, NY 10021',
    description: 'Need assistance setting up electricity, internet, and gas for new apartment.',
    image_url: null,
  },
  {
    id: 'cmid09pqr678',
    user_name: 'Robert Johnson',
    user_email: 'robert.johnson@email.com',
    user_phone: '+1 234 567 8906',
    service_type: 'Cleaning Services',
    status: 'assigned',
    assigned_to: 'partner',
    created_at: '2026-01-10T13:15:00Z',
    priority: 'low',
    property_address: '135 Madison Avenue, Flatiron, NY 10016',
    description: 'Deep cleaning service needed before move-in date.',
    image_url: null,
  },
  {
    id: 'cmid10stu901',
    user_name: 'Amanda Martinez',
    user_email: 'amanda.martinez@email.com',
    user_phone: '+1 234 567 8907',
    service_type: 'Interior Design',
    status: 'cancelled',
    assigned_to: 'unassigned',
    created_at: '2026-01-06T15:20:00Z',
    priority: 'low',
    property_address: '246 Hudson Street, West Village, NY 10013',
    description: 'Client cancelled interior design consultation.',
    image_url: null,
  },
];

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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

  // State for tickets (using mock data)
  const [ticketsData, setTicketsData] = useState(MOCK_TICKETS);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTicket, setAssignTicket] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeTicket, setCloseTicket] = useState(null);

  // Filter tickets based on search, status, assigned, and date range
  const filteredTickets = useMemo(() => {
    let filtered = [...ticketsData];

    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((ticket) => {
        const idMatch = ticket.id.toLowerCase().includes(query);
        const nameMatch = ticket.user_name.toLowerCase().includes(query);
        const emailMatch = ticket.user_email.toLowerCase().includes(query);
        const serviceMatch = ticket.service_type.toLowerCase().includes(query);
        return idMatch || nameMatch || emailMatch || serviceMatch;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Assigned filter
    if (assignedFilter !== 'all') {
      filtered = filtered.filter((ticket) => ticket.assigned_to === assignedFilter);
    }

    // Date range filter
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (start && end) {
          return ticketDate >= start && ticketDate <= end;
        } else if (start) {
          return ticketDate >= start;
        } else if (end) {
          return ticketDate <= end;
        }
        return true;
      });
    }

    return filtered;
  }, [ticketsData, searchTerm, statusFilter, assignedFilter, dateRange]);

  // Calculate stats from filtered tickets
  const stats = useMemo(() => {
    const total = ticketsData.length;
    const pending = ticketsData.filter((t) => t.status === 'pending').length;
    const assigned = ticketsData.filter((t) => t.assigned_to !== 'unassigned').length;

    // Completed today (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const completedToday = ticketsData.filter(
      (t) => t.status === 'completed' && new Date(t.created_at) > oneDayAgo
    ).length;

    return { total, pending, assigned, completedToday };
  }, [ticketsData]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage, itemsPerPage]);

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
  const handleAssignConfirm = useCallback((assignType) => {
    if (!assignTicket) return;

    // Update ticket status and assignment
    setTicketsData((prev) =>
      prev.map((t) =>
        t.id === assignTicket.id
          ? { ...t, assigned_to: assignType, status: 'assigned' }
          : t
      )
    );

    setAssignModalOpen(false);
    setAssignTicket(null);
  }, [assignTicket]);

  const handleCloseConfirm = useCallback(() => {
    if (!closeTicket) return;

    // Remove ticket from list
    setTicketsData((prev) => prev.filter((t) => t.id !== closeTicket.id));

    setCloseModalOpen(false);
    setCloseTicket(null);
  }, [closeTicket]);

  // Translations
  const conciergeTranslations = useMemo(
    () => ({
      title:  'Concierge Tickets',
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
        
        able
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
          totalItems={filteredTickets.length}
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
