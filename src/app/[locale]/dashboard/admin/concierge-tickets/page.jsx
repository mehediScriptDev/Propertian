'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import axios from '@/lib/axios';
import Toast, { showToast } from '@/components/Toast';
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
  // Full list used for client-side paging when server pagination is unreliable
  const [fullTicketsList, setFullTicketsList] = useState(null);
  const [useClientPaging, setUseClientPaging] = useState(false);
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

      try {

        console.log('Concierge tickets API response (raw):', response);
      } catch (e) {

        console.log('Concierge tickets API response (raw) [unserializable]');
      }

      const extractArray = (resp) => {
        if (!resp) return null;
        if (Array.isArray(resp)) return resp;

        // Common direct array locations
        if (Array.isArray(resp.data)) return resp.data;
        if (Array.isArray(resp.requests)) return resp.requests;
        if (Array.isArray(resp.tickets)) return resp.tickets;
        if (Array.isArray(resp.items)) return resp.items;
        if (Array.isArray(resp.results)) return resp.results;

        // Some APIs return { data: { requests: [...] } }
        if (resp.data && typeof resp.data === 'object') {
          if (Array.isArray(resp.data.requests)) return resp.data.requests;
          if (Array.isArray(resp.data.tickets)) return resp.data.tickets;
          if (Array.isArray(resp.data.items)) return resp.data.items;
          if (Array.isArray(resp.data.results)) return resp.data.results;
        }

        // Search one level deep for arrays
        try {
          for (const val of Object.values(resp)) {
            if (Array.isArray(val)) return val;
            if (val && typeof val === 'object') {
              for (const inner of Object.values(val)) {
                if (Array.isArray(inner)) return inner;
              }
            }
          }
        } catch (e) {
          // ignore
        }

        return null;
      };

      const normalizeTicket = (item) => {
        if (!item) return item;

        const get = (a, ...alts) => {
          for (const k of [a, ...alts]) {
            if (item[k] !== undefined && item[k] !== null) return item[k];
          }
          return null;
        };

        const rawStatus = (get('status', 'Status') || '').toString();
        const status = rawStatus ? rawStatus.toLowerCase().replace(/\s+/g, '-') : null;

        const rawPriority = (get('priority') || '').toString();
        const priority = rawPriority ? rawPriority.toLowerCase() : null;

        return {
          id: get('id', '_id', 'ticketId'),
          user_name: get('user_name', 'clientName', 'client_name', 'userName', 'name'),
          user_email: get('user_email', 'clientEmail', 'client_email', 'email'),
          user_phone: get('user_phone', 'clientPhone', 'client_phone', 'phone'),
          service_type: get('service_type', 'serviceType', 'service_type'),
          property_address: get('property_address', 'propertyAddress', 'property_address'),
          priority,
          status,
          assigned_to: get('assigned_to', 'assignedTo', 'assigned') || 'unassigned',
          created_at: get('created_at', 'createdAt', 'created_at'),
          description: get('description', 'details', 'note'),
          image_url: get('image_url', 'image', 'imageUrl') || (item.images && (item.images[0]?.url || item.images[0])) || (item.media && (item.media[0]?.url || item.media[0])) || null,
          raw: item,
        };
      };

      const resp = response?.data || {};
      let items = extractArray(resp);
      if (!items) items = extractArray(resp.data);
      if (!items) items = extractArray(response?.data?.data);
      if (!items) items = [];

      if ((!items || items.length === 0)) {
        try {
        
          console.log('No items from /concierge/tickets — trying fallback /concierge/requests');
          const fallback = await axios.get(`/concierge/requests?${params.toString()}`);
          
          console.log('Fallback response (raw):', fallback);
          const fallbackResp = fallback?.data || {};
          items = extractArray(fallbackResp) || extractArray(fallbackResp.data) || extractArray(fallback?.data?.data) || [];
          
          console.log('Fallback extracted items:', items);
        } catch (err) {
         
          console.warn('Fallback /concierge/requests failed', err);
        }
      }

      const normalized = items.map(normalizeTicket);

    
      console.log('Concierge tickets - extracted items:', items);
  
      console.log('Concierge tickets - normalized items:', normalized);

     
      const paginationFromResp = resp.pagination || (resp.data && resp.data.pagination) || response.pagination || null;

      setTicketsData(normalized || []);

      
      if (paginationFromResp) {
        const serverTotal = Number(paginationFromResp.total) || 0;
        const finalTotal = serverTotal > 0 ? serverTotal : (normalized.length || 0);
        const finalPage = paginationFromResp.page || currentPage;
        const finalLimit = paginationFromResp.limit || itemsPerPage;
        const finalTotalPages = paginationFromResp.totalPages && paginationFromResp.totalPages > 0
          ? paginationFromResp.totalPages
          : Math.max(1, Math.ceil(finalTotal / finalLimit));

        setPagination({
          ...paginationFromResp,
          total: finalTotal,
          page: finalPage,
          limit: finalLimit,
          totalPages: finalTotalPages,
        });
      } else {
        setPagination({
          total: normalized.length || 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.max(1, Math.ceil((normalized.length || 0) / itemsPerPage)),
        });
      }

   
      const serverTotal = Number(paginationFromResp?.total) || 0;
      if ((!paginationFromResp || serverTotal <= normalized.length) && normalized.length > 0) {
        try {
          
          console.log('Attempting full-list fetch to compute total and enable client-side paging...');
          const full = await axios.get('/concierge/requests');
          const fullResp = full?.data || {};
          let fullItems = null;
          if (Array.isArray(fullResp)) fullItems = fullResp;
          else if (Array.isArray(fullResp.data)) fullItems = fullResp.data;
          else if (Array.isArray(fullResp.requests)) fullItems = fullResp.requests;
          else if (Array.isArray(fullResp.data?.requests)) fullItems = fullResp.data.requests;
          else fullItems = [];

          const computedTotal = Array.isArray(fullItems) ? fullItems.length : 0;
          if (computedTotal > 0) {
            
            const normalizedFull = fullItems.map((it) => normalizeTicket(it));
            setFullTicketsList(normalizedFull);
            setUseClientPaging(true);
            const finalTotalPages = Math.max(1, Math.ceil(computedTotal / itemsPerPage));
            setPagination((p) => ({ ...p, total: computedTotal, totalPages: finalTotalPages }));
          
            console.log('Enabled client-side paging, computed total:', computedTotal);
          }
        } catch (err) {
        
          console.warn('Full-list fetch failed:', err);
        }
      } else {
        
        setUseClientPaging(false);
        setFullTicketsList(null);
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
  let paginatedTickets = filteredTickets;
  if (useClientPaging && Array.isArray(fullTicketsList)) {
    const start = (currentPage - 1) * itemsPerPage;
    paginatedTickets = fullTicketsList.slice(start, start + itemsPerPage);
  }
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
      showToast('Failed to assign ticket', 'error');
    }

    setAssignModalOpen(false);
    setAssignTicket(null);
  }, [assignTicket, fetchTickets]);

  const handleCloseConfirm = useCallback(async () => {
    if (!closeTicket) return;

    try {
      // Delete ticket via legacy API route
      await axios.delete(`/concierge/requests/${closeTicket.id}`);

      // Show success toast
      showToast('Ticket deleted successfully', 'success');

      // Refresh tickets from server
      await fetchTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
      showToast('Failed to close ticket', 'error');
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
          totalItems={loading ? 0 : pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={loading ? () => { } : handlePageChange}
          onItemsPerPageChange={loading ? () => { } : handleItemsPerPageChange}
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
      <Toast />
    </div>
  );
}
