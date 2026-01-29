'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { Users, CheckCircle, Clock, FolderOpen, XCircle, ShieldAlert } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import PartnersApplicationsPanel from '@/components/dashboard/admin/PartnersApplicationsPanel';
import ListingSubmissionsPanel from '@/components/dashboard/admin/ListingSubmissionsPanel'; // Ensure this matches your file name
import VerificationRequestsPanel from '@/components/dashboard/admin/VerificationRequestsPanel';
import axiosInstance from '@/lib/axios';

export default function AdminPartnersPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Data States for Partner Tab
  const [applications, setApplications] = useState([]);
  const [statsData, setStatsData] = useState(null);

  // Loading States
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Verification Requests state (admin)
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerifications, setLoadingVerifications] = useState(true);
  const [verifPage, setVerifPage] = useState(1);
  const [verifPagination, setVerifPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  // --- Derive Tab ---
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get('tab') : null;

  const selectedTab = useMemo(() => {
    if (tabParam === 'listing-submissions') return 'listing_submission';
    if (tabParam === 'verification-requests') return 'verification_requests';
    return 'partner_application';
  }, [tabParam]);

  const ITEMS_PER_PAGE = 8;
  const VERIF_ITEMS_PER_PAGE = 20;


  const partnersTranslations = useMemo(
    () => ({
      title: t('dashboard.admin.partners.title'),
      subtitle: t('dashboard.admin.partners.subtitle'),
      // ... (Rest of your translations)
    }),
    [t]
  );

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


  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setStatsData(null);

        let url = '';

        // A. Partners Stats
        if (selectedTab === 'partner_application') {
          url = '/partner/stats';
        }
        // B. Listings Stats (Keep this if you want stats cards for listings)
        else if (selectedTab === 'listing_submission') {
          url = '/admin/property-approval/stats';
        }
        // C. Verification Stats
        else if (selectedTab === 'verification_requests') {
          setStatsData({ total: 0, pending: 0, rejected: 0, verified: 0 });
          setLoadingStats(false);
          return;
        }

        if (url) {
          const response = await axiosInstance.get(url);
          if (response.data.success) {

            const data = response.data.data.stats || response.data.data;
            setStatsData(data);
          }
        }
      } catch (error) {
        console.error(`Error fetching stats for ${selectedTab}:`, error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [selectedTab]);


  useEffect(() => {
    const fetchTableData = async () => {
      // Partner applications
      if (selectedTab === 'partner_application') {
        try {
          setLoadingTable(true);
          let url = `/partner/applications?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

          if (statusFilter !== 'all') {
            url += `&status=${statusFilter}`;
          }

          const response = await axiosInstance.get(url);
          if (response.data.success) {
            setApplications(response.data.data.applications || []);
            setPagination(response.data.data.pagination || { total: 0, totalPages: 1 });
          }
        } catch (error) {
          console.error('Error fetching partner applications:', error);
          setApplications([]);
        } finally {
          setLoadingTable(false);
        }
      }

      // Verification requests (admin)
      if (selectedTab === 'verification_requests') {
        try {
          setLoadingVerifications(true);
          const resp = await axiosInstance.get(`/verifications/admin?page=${verifPage}&limit=${VERIF_ITEMS_PER_PAGE}`);
          if (resp.data && resp.data.success) {
            const data = resp.data.data || {};
            setVerificationRequests(data.verifications || data.verifications || []);
            setVerifPagination(data.pagination || { total: 0, totalPages: 1, page: verifPage, limit: VERIF_ITEMS_PER_PAGE });
          } else {
            setVerificationRequests([]);
          }
        } catch (err) {
          console.error('Error fetching verification requests:', err);
          setVerificationRequests([]);
        } finally {
          setLoadingVerifications(false);
        }
      }
    };

    fetchTableData();
  }, [currentPage, statusFilter, selectedTab, verifPage]);

  // Handlers for verification requests (admin)
  const handleVerifStatusChange = async (id, newStatus) => {
    try {
      // Use admin route for updating verification status (matches backend)
      await axiosInstance.put(`/verifications/admin/${id}/status`, { status: newStatus });
      // refresh current page
      const resp = await axiosInstance.get(`/verifications/admin?page=${verifPage}&limit=${VERIF_ITEMS_PER_PAGE}`);
      if (resp.data && resp.data.success) {
        const data = resp.data.data || {};
        setVerificationRequests(data.verifications || []);
        setVerifPagination(data.pagination || { total: 0, totalPages: 1, page: verifPage, limit: VERIF_ITEMS_PER_PAGE });
      }
    } catch (err) {
      console.error('Failed to update verification status', err);
    }
  };

  const handleVerifPageChange = (page) => {
    setVerifPage(page);
  };


  const stats = useMemo(() => {
    const data = statsData || {};

    if (selectedTab === 'partner_application') {
      return [
        { title: 'Total Applications', value: data.total || 0, icon: Users, variant: 'primary' },
        { title: 'Pending', value: data.pending || 0, icon: Clock, variant: 'warning' },
        { title: 'Under Review', value: data.underReview || 0, icon: FolderOpen, variant: 'info' },
        { title: 'Approved', value: data.approved || 0, icon: CheckCircle, variant: 'success' },
      ];
    }

    if (selectedTab === 'listing_submission') {
      const pending = data.PENDING_APPROVAL ?? data.PENDING ?? 0;
      const underReview = data.NEEDS_REVISION ?? data.UNDER_REVIEW ?? 0;
      const approved = data.APPROVED ?? 0;
      const total = Object.values(data).reduce((sum, v) => sum + (Number(v) || 0), 0);

      return [
        { title: 'Total Submissions', value: total, icon: Users, variant: 'primary' },
        { title: 'Pending Approval', value: pending, icon: Clock, variant: 'warning' },
        { title: 'Under Review', value: underReview, icon: FolderOpen, variant: 'info' },
        { title: 'Approved', value: approved, icon: CheckCircle, variant: 'success' },
      ];
    }

    // Default empty stats
    return [
      { title: 'Total', value: 0, icon: Users, variant: 'primary' },
      { title: 'Pending', value: 0, icon: Clock, variant: 'warning' },
      { title: 'Review', value: 0, icon: FolderOpen, variant: 'info' },
      { title: 'Verified', value: 0, icon: CheckCircle, variant: 'success' },
    ];
  }, [statsData, selectedTab]);

  // --- Handlers for Partner Application Tab ---
  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Only for Partner Applications
      await axiosInstance.put(`/partner/applications/${id}/status`, { status: newStatus });
      window.location.reload();
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/partner/applications/${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>
          {selectedTab === 'listing_submission' ? 'Listing Submissions' :
            selectedTab === 'verification_requests' ? 'Verification Requests' :
              (partnersTranslations.title || 'Partner Applications')}
        </h1>
        <p className='text-sm sm:text-base text-gray-700'>
          {partnersTranslations.subtitle || 'Manage your requests here.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {loadingStats ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
          ))
        ) : (
          stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              variant={stat.variant}
            />
          ))
        )}
      </div>

      {/* CONTENT PANELS */}

      {/* 1. Partner Applications (Parent handles fetching) */}
      {selectedTab === 'partner_application' && (
        <PartnersApplicationsPanel
          partners={applications}
          loading={loadingTable}
          onDelete={handleDelete}
          onStatusChange={handleStatusUpdate}
          tableTranslations={partnersTranslations}
          paginationTranslations={paginationTranslations}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {/* 2. Listing Submissions (Self-contained Child handles fetching) */}
      {selectedTab === 'listing_submission' && (
        <ListingSubmissionsPanel />
      )}

      {/* 3. Verification Requests (Placeholder) */}
      {selectedTab === 'verification_requests' && (
        <VerificationRequestsPanel
          partners={verificationRequests}
          loading={loadingVerifications}
          onDelete={async (id) => {
            try {
              await axiosInstance.delete(`/verifications/${id}`);
              const resp = await axiosInstance.get(`/verifications/admin?page=${verifPage}&limit=${VERIF_ITEMS_PER_PAGE}`);
              if (resp.data && resp.data.success) setVerificationRequests(resp.data.data.verifications || []);
            } catch (err) {
              console.error('Failed to delete verification', err);
            }
          }}
          onStatusChange={handleVerifStatusChange}
          tableTranslations={partnersTranslations}
          paginationTranslations={paginationTranslations}
          currentPage={verifPage}
          totalPages={verifPagination.totalPages}
          totalItems={verifPagination.total}
          itemsPerPage={VERIF_ITEMS_PER_PAGE}
          onPageChange={handleVerifPageChange}
        />
      )}
    </div>
  );
}