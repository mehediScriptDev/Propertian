'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import SponsorApplicationsTable from '@/components/dashboard/admin/SponsorApplicationsTable';
import Pagination from '@/components/dashboard/Pagination';
import ViewApplicationModal from '@/components/dashboard/admin/ViewApplicationModal';
import ApproveApplicationModal from '@/components/dashboard/admin/ApproveApplicationModal';
import RejectApplicationModal from '@/components/dashboard/admin/RejectApplicationModal';

// Mock sponsor application data
const MOCK_APPLICATIONS = [
  {
    id: 'app001',
    company_name: 'Luxury Real Estate Group',
    contact_person: 'Sarah Johnson',
    email: 'sarah@luxuryrealestate.com',
    phone: '+1 234 567 8900',
    country: 'United States',
    applied_date: '2026-01-08T10:30:00Z',
    status: 'pending',
    description: 'We are a premier luxury real estate company specializing in high-end properties across major cities. We would like to sponsor property showcase events and exclusive open houses.',
    website: 'https://luxuryrealestate.com',
  },
  {
    id: 'app002',
    company_name: 'Modern Living Developments',
    contact_person: 'Michael Chen',
    email: 'michael@modernliving.com',
    phone: '+1 234 567 8901',
    country: 'Canada',
    applied_date: '2026-01-07T14:20:00Z',
    status: 'approved',
    description: 'Modern Living Developments focuses on sustainable and innovative residential projects. We want to host educational webinars and community events.',
    website: 'https://modernliving.com',
  },
  {
    id: 'app003',
    company_name: 'Global Property Solutions',
    contact_person: 'Emma Williams',
    email: 'emma@globalpropsolutions.com',
    phone: '+44 20 1234 5678',
    country: 'United Kingdom',
    applied_date: '2026-01-06T09:15:00Z',
    status: 'pending',
    description: 'International property management and investment company looking to sponsor networking events for investors and developers.',
    website: 'https://globalpropsolutions.com',
  },
  {
    id: 'app004',
    company_name: 'Urban Development Corp',
    contact_person: 'David Rodriguez',
    email: 'david@urbandevelopment.com',
    phone: '+1 555 123 4567',
    country: 'United States',
    applied_date: '2026-01-05T16:45:00Z',
    status: 'rejected',
    description: 'Incomplete business information and unclear sponsorship goals.',
    website: 'https://urbandevelopment.com',
  },
  {
    id: 'app005',
    company_name: 'Prime Properties International',
    contact_person: 'Lisa Anderson',
    email: 'lisa@primeproperties.com',
    phone: '+61 2 9876 5432',
    country: 'Australia',
    applied_date: '2026-01-10T11:30:00Z',
    status: 'pending',
    description: 'Leading property development company with projects in Sydney, Melbourne, and Brisbane. Interested in sponsoring property investment seminars.',
    website: 'https://primeproperties.com.au',
  },
  {
    id: 'app006',
    company_name: 'Skyline Realty Partners',
    contact_person: 'James Thompson',
    email: 'james@skylinerealty.com',
    phone: '+1 312 555 7890',
    country: 'United States',
    applied_date: '2026-01-09T13:00:00Z',
    status: 'approved',
    description: 'Established real estate firm with 20+ years experience. Looking to sponsor luxury property showcases and investor meetups.',
    website: 'https://skylinerealty.com',
  },
];

export default function SponsorApplicationsPage({ params }) {
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
  const [applicationsData, setApplicationsData] = useState(MOCK_APPLICATIONS);
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
