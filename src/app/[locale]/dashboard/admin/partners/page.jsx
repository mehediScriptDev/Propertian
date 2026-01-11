'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { Users, CheckCircle, Clock, FolderOpen } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import PartnersApplicationsPanel from '@/components/dashboard/admin/PartnersApplicationsPanel';
import ListingSubmissionsPanel from '@/components/dashboard/admin/ListingSubmissionsPanel';
import VerificationRequestsPanel from '@/components/dashboard/admin/VerificationRequestsPanel';
import Pagination from '@/components/dashboard/Pagination';
import axiosInstance from '@/lib/axios';

export default function AdminPartnersPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Derive selected tab from `?tab=` query param. Defaults to partner_application.
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get('tab') : null;
  const selectedTab = useMemo(() => {
    if (tabParam === 'listing-submissions') return 'listing_submission';
    if (tabParam === 'verification-requests') return 'verification_requests';
    return 'partner_application';
  }, [tabParam]);

  // Constants
  const ITEMS_PER_PAGE = 8;

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let url = `/partner/applications?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
      
      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`; 
      }
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setApplications(response.data.data.applications);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching partner applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized translations
  const partnersTranslations = useMemo(
    () => ({
      title: t('dashboard.admin.partners.title'),
      subtitle: t('dashboard.admin.partners.subtitle'),
      addPartner: t('dashboard.admin.partners.addPartner'),
      searchPlaceholder: t('dashboard.admin.partners.searchPlaceholder'),
      stats: {
        totalPartners: t('dashboard.admin.partners.stats.totalPartners'),
        verified: t('dashboard.admin.partners.stats.verified'),
        pending: t('dashboard.admin.partners.stats.pending'),
        activeProjects: t('dashboard.admin.partners.stats.activeProjects'),
      },
      filters: {
        verification: t('dashboard.admin.partners.filters.verification'),
        payment: t('dashboard.admin.partners.filters.payment'),
        allVerification: t('dashboard.admin.partners.filters.allVerification'),
        allPayment: t('dashboard.admin.partners.filters.allPayment'),
      },
      table: {
        company: t('dashboard.admin.partners.table.company'),
        contact: t('dashboard.admin.partners.table.contact'),
        email: t('dashboard.admin.partners.table.email'),
        phone: t('dashboard.admin.partners.table.phone'),
        projects: t('dashboard.admin.partners.table.projects'),
        verification: t('dashboard.admin.partners.table.verification'),
        payment: t('dashboard.admin.partners.table.payment'),
        actions: t('dashboard.admin.partners.table.actions'),
        view: t('dashboard.admin.partners.table.view'),
        edit: t('dashboard.admin.partners.table.edit'),
        delete: t('dashboard.admin.partners.table.delete'),
        joined: t('dashboard.admin.partners.table.joined'),
      },
      verification: {
        verified: t('dashboard.admin.partners.verification.verified'),
        pending: t('dashboard.admin.partners.verification.pending'),
        rejected: t('dashboard.admin.partners.verification.rejected'),
      },
      payment: {
        paid: t('dashboard.admin.partners.payment.paid'),
        unpaid: t('dashboard.admin.partners.payment.unpaid'),
        partial: t('dashboard.admin.partners.payment.partial'),
      },
    }),
    [t]
  );

  // Calculate stats
  const stats = useMemo(() => {
    const pendingCount = applications.filter((p) => p.status === 'PENDING').length;
    const underReviewCount = applications.filter((p) => p.status === 'UNDER_REVIEW').length;
    const approvedCount = applications.filter((p) => p.status === 'APPROVED').length;

    return [
      {
        title: 'Total',
        value: pagination.total,
        trend: '+8.3%',
        icon: Users,
        variant: 'primary',
      },
      {
        title: 'Pending',
        value: pendingCount,
        trend: '-5.2%',
        icon: Clock,
        variant: 'warning',
      },
      {
        title: 'Under Review',
        value: underReviewCount,
        trend: '+12.5%',
        icon: FolderOpen,
        variant: 'info',
      },
      {
        title: 'Approved',
        value: approvedCount,
        trend: '+15.8%',
        icon: CheckCircle,
        variant: 'success',
      },
    ];
  }, [applications, pagination.total]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || app.status === statusFilter;

      const matchesVerification =
        verificationFilter === 'all' ||
        (verificationFilter === 'verified' && app.isVerified) ||
        (verificationFilter === 'pending' && !app.isVerified);

      const matchesPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && app.isPaid) ||
        (paymentFilter === 'unpaid' && !app.isPaid);

      return matchesSearch && matchesStatus && matchesVerification && matchesPayment;
    });
  }, [applications, searchTerm, statusFilter, verificationFilter, paymentFilter]);

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleVerificationChange = useCallback((value) => {
    setVerificationFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePaymentChange = useCallback((value) => {
    setPaymentFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/partner/applications/${id}`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/partner/applications/${id}/status`, { 
        status: newStatus,
        adminNotes: `Status changed to ${newStatus}`
      });
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  // Pagination translations
  const paginationTranslations = useMemo(
    () => ({
      previous: t('common.previous'),
      next: t('common.next'),
      showing: t('common.showing'),
      to: t('common.to'),
      of: t('common.of'),
      results: t('common.results'),
    }),
    [t]
  );

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className=''>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>
          {partnersTranslations.title}
        </h1>
        <p className='text-sm sm:text-base text-gray-700'>
          {partnersTranslations.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Tabs removed: sidebar controls the active panel via ?tab= */}

      {/* Panels (table + pagination) per tab */}
      {selectedTab === 'partner_application' && (
        <PartnersApplicationsPanel
          partners={filteredApplications}
          loading={loading}
          onDelete={handleDelete}
          onStatusChange={handleStatusUpdate}
          onRefresh={fetchApplications}
          tableTranslations={partnersTranslations}
          paginationTranslations={paginationTranslations}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {selectedTab === 'listing_submission' && (
        <ListingSubmissionsPanel
          partners={filteredApplications}
          loading={loading}
          onDelete={handleDelete}
          onStatusChange={handleStatusUpdate}
          onRefresh={fetchApplications}
          tableTranslations={partnersTranslations}
          paginationTranslations={paginationTranslations}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {selectedTab === 'verification_requests' && (
        <VerificationRequestsPanel
          partners={filteredApplications}
          loading={loading}
          onDelete={handleDelete}
          onStatusChange={handleStatusUpdate}
          onRefresh={fetchApplications}
          tableTranslations={partnersTranslations}
          paginationTranslations={paginationTranslations}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
