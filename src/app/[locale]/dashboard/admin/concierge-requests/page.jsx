'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { get } from '@/lib/api';
import { useTranslation } from '@/i18n';
import { Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import ConciergeRequestsFilters from '@/components/dashboard/admin/ConciergeRequestsFilters';
import ConciergeRequestsTable from '@/components/dashboard/admin/ConciergeRequestsTable';
import Pagination from '@/components/dashboard/Pagination';

// Service types for concierge requests
const SERVICE_TYPES = [
  'Property Viewing Coordination',
  'Document Translation',
  'Legal Assistance',
  'Moving & Relocation',
  'Utility Setup',
  'Property Maintenance',
  'Interior Design Consultation',
  'Cleaning Services',
  'Security Installation',
  'Rental Agreement Support',
  'Property Insurance',
  'Furniture Rental',
];

// NOTE: removed dummy/mock data — page now fetches live concierge requests from the API.

export default function ConciergeRequestsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const ITEMS_PER_PAGE = 5;

  // Requests data (fetched from backend)
  const [requestsData, setRequestsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch concierge requests from API (server-driven pagination)
  useEffect(() => {
    const controller = new AbortController();

    async function loadRequests() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        };
        if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
        if (priorityFilter !== 'all') params.priority = priorityFilter.toUpperCase();
        if (searchTerm) params.search = searchTerm;

        // use common API helper which wraps axios
        const json = await get('/concierge/requests', { params });

        // normalize response shape (api.get returns response.data)
        const data = json?.data ?? json;
        const list = data?.requests || data?.requests || data || [];

        const apiRequests = (list || []).map((r) => ({
          id: r.id || r._id || r.requestId,
          client_name: r.clientName || r.client_name || r.client_name || '',
          client_email: r.clientEmail || r.client_email || r.client_email || '',
          client_phone: r.clientPhone || r.client_phone || r.client_phone || '',
          service_type: r.serviceType || r.service_type || r.service || '',
          property_address: r.propertyAddress || r.property_address || r.property || '',
          // map any image-like fields into image_url
          image_url:
            r.image || r.imageUrl || r.image_url || r.propertyImage || r.property_image || r.thumbnail || r.cover || (r.attachments && r.attachments[0] && (r.attachments[0].url || r.attachments[0].src)) || null,
          priority: (r.priority || '').toString().toLowerCase(),
          status: (r.status || '').toString().toLowerCase(),
          description: r.description || r.note || r.notes || '',
          created_at: r.createdAt || r.created_at,
          updated_at: r.updatedAt || r.updated_at,
        }));

        setRequestsData(apiRequests);

        const total = data?.total ?? data?.meta?.total ?? json?.total ?? apiRequests.length;
        setTotalItems(Number(total));
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
    return () => controller.abort();
  }, [currentPage, statusFilter, priorityFilter, searchTerm]);

  // When backend provides filtered/paginated data, use it directly.
  // We still keep search/status/priority in the deps that trigger refetch.
  const filteredRequests = useMemo(() => requestsData, [requestsData]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = requestsData.length;
    const pending = requestsData.filter((r) => r.status === 'pending').length;
    const inProgress = requestsData.filter(
      (r) => r.status === 'in-progress'
    ).length;

    // Completed today (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const completedToday = requestsData.filter(
      (r) => r.status === 'completed' && new Date(r.updated_at) > oneDayAgo
    ).length;

    return { total, pending, inProgress, completedToday };
  }, [requestsData]);

  // Pagination (server-driven)
  const totalPages = Math.ceil((totalItems || 0) / ITEMS_PER_PAGE);

  // Server already returns page-limited items for currentPage, so use requestsData directly
  const paginatedRequests = useMemo(() => requestsData, [requestsData]);

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePriorityChange = useCallback((value) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Translations
  const conciergeTranslations = useMemo(
    () => ({
      title: t('dashboard.admin.conciergeRequests.title'),
      subtitle: t('dashboard.admin.conciergeRequests.subtitle'),
      addRequest: t('dashboard.admin.conciergeRequests.addRequest'),
      searchPlaceholder: t(
        'dashboard.admin.conciergeRequests.searchPlaceholder'
      ),
      filters: {
        allStatus: t('dashboard.admin.conciergeRequests.filters.allStatus'),
        allPriority: t('dashboard.admin.conciergeRequests.filters.allPriority'),
      },
      status: {
        pending: t('dashboard.admin.conciergeRequests.status.pending'),
        inProgress: t('dashboard.admin.conciergeRequests.status.inProgress'),
        completed: t('dashboard.admin.conciergeRequests.status.completed'),
        cancelled: t('dashboard.admin.conciergeRequests.status.cancelled'),
      },
      priority: {
        high: t('dashboard.admin.conciergeRequests.priority.high'),
        medium: t('dashboard.admin.conciergeRequests.priority.medium'),
        low: t('dashboard.admin.conciergeRequests.priority.low'),
      },
      table: {
        requestId: t('dashboard.admin.conciergeRequests.table.requestId'),
        client: t('dashboard.admin.conciergeRequests.table.client'),
        service: t('dashboard.admin.conciergeRequests.table.service'),
        property: t('dashboard.admin.conciergeRequests.table.property'),
        priority: t('dashboard.admin.conciergeRequests.table.priority'),
        status: t('dashboard.admin.conciergeRequests.table.status'),
        requestDate: t('dashboard.admin.conciergeRequests.table.requestDate'),
        actions: t('dashboard.admin.conciergeRequests.table.actions'),
        view: t('dashboard.admin.conciergeRequests.table.view'),
      },
    }),
    [t]
  );

  const statsTranslations = useMemo(
    () => ({
      totalRequests: t('dashboard.admin.conciergeRequests.stats.totalRequests'),
      pending: t('dashboard.admin.conciergeRequests.stats.pending'),
      inProgress: t('dashboard.admin.conciergeRequests.stats.inProgress'),
      completed: t('dashboard.admin.conciergeRequests.stats.completed'),
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
          title={statsTranslations.totalRequests}
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
          title={statsTranslations.inProgress}
          value={stats.inProgress}
          icon={AlertCircle}
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
        priorityFilter={priorityFilter}
        onPriorityChange={handlePriorityChange}
        translations={conciergeTranslations}
      />

      {/* Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <ConciergeRequestsTable
          requests={paginatedRequests}
          translations={conciergeTranslations}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems || paginatedRequests.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          translations={paginationTranslations}
        />
      </div>
    </div>
  );
}
