'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import SponsorApplicationsTable from '@/components/dashboard/admin/SponsorApplicationsTable';
import Pagination from '@/components/dashboard/Pagination';
import ViewApplicationModal from '@/components/dashboard/admin/ViewApplicationModal';
import ApproveApplicationModal from '@/components/dashboard/admin/ApproveApplicationModal';
import RejectApplicationModal from '@/components/dashboard/admin/RejectApplicationModal';
import { get, put } from '@/lib/api';

// Applications will be loaded from the API

export default function SponsorApplicationsPage({ params }) {
  const { locale } = React.use(params) || {};
  const { t } = useTranslation(locale);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  // State for applications (loaded from API)
  const [applicationsData, setApplicationsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to resolve image URLs (absolute or relative)
  const resolveImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (/^https?:\/\//i.test(imgPath) || imgPath.startsWith("//")) return imgPath;
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    return `${base.replace(/\/$/, "")}/${String(imgPath).replace(/^\//, "")}`;
  };

  // Fetch sponsor applications from API
  useEffect(() => {
    let mounted = true;

    async function fetchApplications() {
      setLoading(true);
      setError(null);
      try {
        const res = await get(`/partner/applications?page=1&limit=1000`);
        const apps = res?.data?.applications || res?.applications || [];

        const mapped = (apps || []).map((item) => ({
          id: item.id || item._id || item.applicationId,
          company_name: item.company_name || item.companyName || item.fullName || item.fullname || item.name || '',
          contact_person: item.contact_person || item.contactPerson || item.fullName || item.fullname || '',
          email: item.email || item.userEmail || '',
          phone: item.phone || item.contactNumber || item.phoneNumber || '',
          country: item.country || item.cityCountry || item.countryName || '',
          applied_date: item.applied_date || item.createdAt || item.created_at || item.createdAt || '',
          status: (item.status || '').toLowerCase(),
          description: item.description || item.message || item.adminNotes || '',
          website: item.website || item.url || '',
          image: resolveImageUrl(item.photo || item.image || item.profileImage || item.photos?.[0] || item.media?.[0]),
        }));

        if (mounted) setApplicationsData(mapped);
      } catch (err) {
        console.error('Failed to load sponsor applications:', err);
        if (mounted) setError(err?.message || 'Failed to load applications');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchApplications();

    return () => {
      mounted = false;
    };
  }, []);

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
    const pending = applicationsData.filter((a) => a.status === 'pending').length;
    const approved = applicationsData.filter((a) => a.status === 'approved').length;
    const rejected = applicationsData.filter((a) => a.status === 'rejected').length;

    return { total, pending, approved, rejected };
  }, [applicationsData]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, itemsPerPage]);

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

  // Action handlers
  const handleView = useCallback((application) => {
    setViewApplication(application);
    setViewModalOpen(true);
  }, []);

  const handleApprove = useCallback((application) => {
    setApproveApplication(application);
    setApproveModalOpen(true);
  }, []);

  // Immediate approve (update via API) — called when clicking check button directly
  const handleApproveImmediate = useCallback(async (application) => {
    if (!application?.id) return;
    try {
      setLoading(true);
      // API expects status value like 'APPROVED'
      await put(`/partner/applications/${application.id}/status`, { status: 'APPROVED' });
      // update local state
      setApplicationsData((prev) => prev.map((a) => (a.id === application.id ? { ...a, status: 'approved' } : a)));
    } catch (err) {
      console.error('Failed to approve application:', err);
      // Optionally show error toast
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReject = useCallback((application) => {
    setRejectApplication(application);
    setRejectModalOpen(true);
  }, []);

  // Modal handlers
  const handleApproveConfirm = useCallback(() => {
    if (!approveApplication) return;

    // Update application status
    setApplicationsData((prev) =>
      prev.map((a) =>
        a.id === approveApplication.id ? { ...a, status: 'approved' } : a
      )
    );

    setApproveModalOpen(false);
    setApproveApplication(null);
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
          Sponsor Applications
        </h1>
        <p className='text-sm sm:text-base text-gray-700 mt-2'>
          Review and manage sponsor partner applications
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
          onApproveImmediate={handleApproveImmediate}
          onReject={handleReject}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredApplications.length}
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
