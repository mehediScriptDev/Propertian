"use client";

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import SponsorApplicationsTable from '@/components/dashboard/admin/SponsorApplicationsTable';
import Pagination from '@/components/dashboard/Pagination';
import ViewApplicationModal from '@/components/dashboard/admin/ViewApplicationModal';
import ApproveApplicationModal from '@/components/dashboard/admin/ApproveApplicationModal';
import RejectApplicationModal from '@/components/dashboard/admin/RejectApplicationModal';
import { getApplications, updateApplicationStatus } from '@/services/conciergeAPI';

// Note: removed mock data - data will be fetched from API

export default function ConciergeApplicationsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  // State for applications (using mock data)
  const [applicationsData, setApplicationsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewApplication, setViewApplication] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveApplication, setApproveApplication] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectApplication, setRejectApplication] = useState(null);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applicationsData];

    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((app) => {
        const companyMatch = app.company_name.toLowerCase().includes(query);
        const contactMatch = app.contact_person.toLowerCase().includes(query);
        const emailMatch = app.email.toLowerCase().includes(query);
        const countryMatch = app.country.toLowerCase().includes(query);
        return companyMatch || contactMatch || emailMatch || countryMatch;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    return filtered;
  }, [applicationsData, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = applicationsData.length;
    const pending = applicationsData.filter((a) => (a.status || '').toString().toLowerCase() === 'pending').length;
    const approved = applicationsData.filter((a) => (a.status || '').toString().toLowerCase() === 'approved').length;
    const rejected = applicationsData.filter((a) => (a.status || '').toString().toLowerCase() === 'rejected').length;

    return { total, pending, approved, rejected };
  }, [applicationsData]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedApplications = useMemo(() => {
    // when server-side pagination is used, applicationsData already contains current page
    return applicationsData;
  }, [applicationsData]);

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  // Fetch applications from API whenever pagination/filters/search change
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (statusFilter && statusFilter !== 'all') {
          // API uses uppercase status (e.g. PENDING) per backend convention
          params.status = statusFilter.toUpperCase();
        }

        if (searchTerm && searchTerm.trim() !== '') {
          // include a search param if backend supports it (try "search" and "q")
          params.search = searchTerm.trim();
        }

        const response = await getApplications(params, { signal: controller.signal });

        if (!isMounted) return;

        // Response may come in several shapes. Normalize it.
        const payload = response || {};

        // Possible locations for items: payload.data, payload.items, or payload (array)
        let items = [];
        if (Array.isArray(payload)) {
          items = payload;
        } else if (Array.isArray(payload.data)) {
          items = payload.data;
        } else if (Array.isArray(payload.items)) {
          items = payload.items;
        }

        // Normalize backend fields (camelCase) to UI expected snake_case keys
        const normalize = (it) => {
          if (!it) return {};
          const countryFromAddress = typeof it.address === 'string' ? it.address : it.address?.country || '';
          return {
            id: it.id || it._id || it.uuid || it.applicationId,
            company_name: it.companyName || it.company_name || it.company || it.name || '',
            contact_person: it.contactPerson || it.contact_person || it.contact || it.contactName || '',
            email: it.email || it.mail || '',
            phone: it.phone || it.telephone || it.contactPhone || it.mobile || '',
            country: it.country || it.country_name || countryFromAddress || '',
            applied_date: it.appliedAt || it.applied_date || it.createdAt || it.created_at || it.updatedAt || it.updated_at || null,
            status: (it.status || it.applicationStatus || it.state || '').toString(),
            logo: it.logo || it.image || it.thumbnail || it.avatar || null,
            description: it.description || it.bio || '',
            website: it.website || it.url || null,
            raw: it,
          };
        };

        const normalizedItems = items.map(normalize);
        setApplicationsData(normalizedItems);

        // Try to read total count from pagination / meta / top-level
        const pagination = payload.pagination || payload.meta || payload.paging || {};
        const total =
          pagination.total || pagination.count || pagination.totalItems || payload.total || payload.count || 0;

        setTotalItems(Number(total) || items.length);
      } catch (err) {
        if (err?.canceled || err?.message === 'canceled') {
          // fetch aborted
        } else {
          console.error('Failed to fetch applications:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, itemsPerPage, statusFilter, searchTerm]);

  // Action handlers
  const handleView = useCallback((application) => {
    setViewApplication(application);
    setViewModalOpen(true);
  }, []);

  const handleApprove = useCallback((application) => {
    setApproveApplication(application);
    setApproveModalOpen(true);
  }, []);

  const handleReject = useCallback((application) => {
    setRejectApplication(application);
    setRejectModalOpen(true);
  }, []);

  // Modal handlers
  const handleApproveConfirm = useCallback(() => {
    if (!approveApplication) return;

    const doApprove = async () => {
      setLoading(true);
      try {
        // body follows backend conventions (uppercase status)
        const body = { status: 'APPROVED' };

        // If our normalized object kept raw id/schema, try to use raw id as fallback
        const appId = approveApplication.id || approveApplication.raw?.id || approveApplication.raw?._id;

        if (!appId) throw new Error('Application id missing');

        await updateApplicationStatus(appId, body);

        // Optimistically update UI
        setApplicationsData((prev) =>
          prev.map((a) =>
            a.id === (approveApplication.id) ? { ...a, status: 'approved' } : a
          )
        );

        setApproveModalOpen(false);
        setApproveApplication(null);
      } catch (err) {
        console.error('Approve failed', err);
      } finally {
        setLoading(false);
      }
    };

    doApprove();
  }, [approveApplication]);

  const handleRejectConfirm = useCallback(() => {
    if (!rejectApplication) return;

    // Update application status
    setApplicationsData((prev) =>
      prev.map((a) =>
        a.id === rejectApplication.id ? { ...a, status: 'rejected' } : a
      )
    );

    setRejectModalOpen(false);
    setRejectApplication(null);
  }, [rejectApplication]);

  // Pagination translations
  const paginationTranslations = useMemo(
    () => ({
      showing: t('common.showing') || 'Showing',
      to: t('common.to') || 'to',
      of: t('common.of') || 'of',
      results: t('common.results') || 'results',
      previous: t('common.previous') || 'Previous',
      next: t('common.next') || 'Next',
    }),
    [t]
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900'>
          Concierge Partner Applications
        </h1>
        <p className='text-sm sm:text-base text-gray-700 mt-2'>
          Review and manage concierge partner applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Applications'
          value={stats.total}
          icon={FileText}
          trend='+12%'
          trendLabel='vs last month'
        />
        <StatsCard
          title='Pending Review'
          value={stats.pending}
          icon={Clock}
          trend='+5%'
          trendLabel='this week'
        />
        <StatsCard
          title='Approved'
          value={stats.approved}
          icon={CheckCircle}
          trend='+8%'
          trendLabel='this month'
        />
        <StatsCard
          title='Rejected'
          value={stats.rejected}
          icon={XCircle}
          trend='-2%'
          trendLabel='vs last month'
        />
      </div>

      {/* Filters */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
          {/* Search */}
          <div className='w-full sm:flex-1'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Search by company, contact, email, or country...'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent'
            />
          </div>

          {/* Status Filter */}
          <div className='w-full sm:w-56'>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <SponsorApplicationsTable
          applications={paginatedApplications}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={loading}
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

      {/* Modals */}
      <ViewApplicationModal
        open={viewModalOpen}
        application={viewApplication}
        onClose={() => setViewModalOpen(false)}
      />
      <ApproveApplicationModal
        open={approveModalOpen}
        application={approveApplication}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
      />
      <RejectApplicationModal
        open={rejectModalOpen}
        application={rejectApplication}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
