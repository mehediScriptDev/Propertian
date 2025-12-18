'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { get, del, patch } from '@/lib/api';
import RequestEditModal from '@/components/dashboard/admin/RequestEditModal';
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Constants
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

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
        // Detect if user is searching by an ID-like token (e.g. '#cmid03..' or long alphanumeric)
        const rawQuery = (searchTerm || '').toString().trim();
        const plainQuery = rawQuery.startsWith('#') ? rawQuery.slice(1) : rawQuery;
        const isIdSearch = !!plainQuery && /^[a-z0-9_-]{6,}$/i.test(plainQuery);

        if (isIdSearch) {
          // Try fetching a single request by id. If the API exposes such endpoint,
          // this will return the exact item even if server-side list search doesn't.
          try {
            const single = await get(`/concierge/requests/${encodeURIComponent(plainQuery)}`);
            const singleData = single?.data ?? single;
            const found = singleData?.request || singleData || null;
            if (found) {
              const mapped = {
                id: found.id || found._id || found.requestId,
                client_name: found.clientName || found.client_name || found.client_name || '',
                client_email: found.clientEmail || found.client_email || found.client_email || '',
                client_phone: found.clientPhone || found.client_phone || found.client_phone || '',
                service_type: found.serviceType || found.service_type || found.service || '',
                property_address: found.propertyAddress || found.property_address || found.property || '',
                image_url:
                  found.image || found.imageUrl || found.image_url || found.propertyImage || found.property_image || found.thumbnail || found.cover || (found.attachments && found.attachments[0] && (found.attachments[0].url || found.attachments[0].src)) || null,
                priority: (found.priority || '').toString().toLowerCase().replace(/_/g, '-'),
                status: (found.status || '').toString().toLowerCase().replace(/_/g, '-'),
                description: found.description || found.note || found.notes || '',
                created_at: found.createdAt || found.created_at,
                updated_at: found.updatedAt || found.updated_at,
              };

              setRequestsData([mapped]);
              setTotalItems(1);
              setLoading(false);
              return;
            }
          } catch (err) {
            // If single-item endpoint doesn't exist or fails, fall back to list fetch below
            // but don't stop — continue to the listing logic
            // console.debug('single id fetch failed, falling back to list', err);
          }
        }

        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        };
        if (statusFilter !== 'all') {
          // API may expect underscores instead of dashes (IN_PROGRESS vs in-progress)
          params.status = statusFilter.replace(/-/g, '_').toUpperCase();
        }
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
          // Normalize incoming status/priority to dashed lower-case to match UI values
          priority: (r.priority || '').toString().toLowerCase().replace(/_/g, '-'),
          status: (r.status || '').toString().toLowerCase().replace(/_/g, '-'),
          description: r.description || r.note || r.notes || '',
          created_at: r.createdAt || r.created_at,
          updated_at: r.updatedAt || r.updated_at,
        }));

        // Apply client-side filtering/search so UI filters work even if API
        // doesn't support those query params or returns page-limited results.
        const applyClientFilters = (items) => {
          let filtered = items;

          if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter((it) => (it.status || '') === statusFilter);
          }

          if (priorityFilter && priorityFilter !== 'all') {
            filtered = filtered.filter((it) => (it.priority || '') === priorityFilter);
          }

          if (searchTerm && searchTerm.trim() !== '') {
            // allow searching by id (with or without leading '#') and other fields
            let q = searchTerm.toLowerCase().trim();
            // strip leading # if user pasted '#abcd1234'
            if (q.startsWith('#')) q = q.slice(1);
            filtered = filtered.filter((it) => {
              const idStr = (it.id || '').toString().toLowerCase();
              return (
                idStr.includes(q) ||
                (it.client_name || '').toLowerCase().includes(q) ||
                (it.client_email || '').toLowerCase().includes(q) ||
                (it.client_phone || '').toLowerCase().includes(q) ||
                (it.service_type || '').toLowerCase().includes(q) ||
                (it.property_address || '').toLowerCase().includes(q) ||
                (it.description || '').toLowerCase().includes(q)
              );
            });
          }

          return filtered;
        };

        // Always keep raw API list; then decide what to show in state
        // Use server-returned list and paging metadata so pagination remains server-driven.
        setRequestsData(apiRequests);
        const total = data?.pagination?.total ?? data?.total ?? data?.meta?.total ?? json?.pagination?.total ?? json?.total ?? apiRequests.length;
        setTotalItems(Number(total));
      } catch (e) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
    return () => controller.abort();
  }, [currentPage, statusFilter, priorityFilter, searchTerm, itemsPerPage]);

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
  const totalPages = Math.ceil((totalItems || 0) / itemsPerPage);

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

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  // Delete handler: called from table via onDelete prop
  const handleDelete = useCallback(async (id) => {
    try {
      setLoading(true);
      await del(`/concierge/requests/${encodeURIComponent(id)}`);

      // Remove from current list and adjust total
      setRequestsData((prev) => prev.filter((r) => String(r.id) !== String(id)));
      setTotalItems((prev) => Math.max(0, (Number(prev) || 0) - 1));
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Edit flow: open modal (table will call this via onEdit prop)
  const [editTarget, setEditTarget] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = useCallback((request) => {
    setEditTarget(request);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdate = useCallback(async (updated) => {
    try {
      setLoading(true);
      const id = updated.id;

      // Prepare payload for API — map keys back to API shape if needed
      const payload = {
        clientName: updated.client_name,
        clientEmail: updated.client_email,
        clientPhone: updated.client_phone,
        serviceType: updated.service_type,
        propertyAddress: updated.property_address,
        priority: (updated.priority || '').toString().toUpperCase(),
        status: (updated.status || '').toString().replace(/-/g, '_').toUpperCase(),
        description: updated.description,
      };

      const res = await patch(`/concierge/requests/${encodeURIComponent(id)}`, payload);
      const data = res?.data ?? res;
      const updatedItem = data?.request || data || null;

      // Map response to UI shape; fall back to `updated` values if API doesn't return full object
      const mapped = {
        id: updatedItem?.id || updatedItem?._id || id,
        client_name: updatedItem?.clientName || updated.client_name,
        client_email: updatedItem?.clientEmail || updated.client_email,
        client_phone: updatedItem?.clientPhone || updated.client_phone,
        service_type: updatedItem?.serviceType || updated.client_service || updated.service_type,
        property_address: updatedItem?.propertyAddress || updated.property_address,
        priority: (updatedItem?.priority || updated.priority || '').toString().toLowerCase().replace(/_/g, '-'),
        status: (updatedItem?.status || updated.status || '').toString().toLowerCase().replace(/_/g, '-'),
        description: updatedItem?.description || updated.description || '',
        created_at: updatedItem?.createdAt || updated.created_at,
        updated_at: updatedItem?.updatedAt || new Date().toISOString(),
      };

      setRequestsData((prev) => prev.map((it) => (String(it.id) === String(mapped.id) ? mapped : it)));
      setIsEditModalOpen(false);
      setEditTarget(null);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
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
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          showItemsPerPage={true}
          translations={paginationTranslations}
        />
      </div>
      <RequestEditModal open={isEditModalOpen} request={editTarget} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdate} />
    </div>
  );
}
