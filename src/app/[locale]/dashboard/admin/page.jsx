'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Building2, Users, MessageSquare, ClipboardList } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import UserEngagementChart from '@/components/dashboard/admin/UserEngagementChart';
import PropertiesTable from '@/components/dashboard/admin/PropertiesTable';
import UsersTable from '@/components/dashboard/admin/UsersTable';
import InquiriesTable from '@/components/dashboard/admin/InquiriesTable';
import Pagination from '@/components/dashboard/Pagination';
import { get } from '@/lib/api';
import RecentUserTable from './Components/RecentUserTable';
import ApprovedPartnersTable from './Components/ApprovedPartnersTable';

export default function AdminDashboardPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedPartners, setApprovedPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await get('/dashboard/analytics');
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Fetch approved partners
  useEffect(() => {
    const fetchApprovedPartners = async () => {
      try {
        setPartnersLoading(true);
        const response = await get('/partner/approved');
        
        if (response.success && response.data) {
          const partners = Array.isArray(response.data) ? response.data : response.data.partners || [];
          
          // Map partner data to table format
          const mappedPartners = partners.map(partner => ({
            id: partner.id,
            name: `${partner.firstName || ''} ${partner.lastName || ''}`.trim() || 'Unknown',
            companyName: partner.companyName || partner.name || 'N/A',
            email: partner.email || 'N/A',
            phone: partner.phone || partner.phoneNumber || null,
            role: partner.role || 'PARTNER',
            city: partner.city || null,
            address: partner.address || null,
            description: partner.description || null,
            status: partner.status?.toLowerCase() || 'approved',
            statusLabel: partner.status === 'APPROVED' ? 'Approved' 
              : partner.status === 'PENDING' ? 'Pending'
              : partner.status === 'REJECTED' ? 'Rejected'
              : 'Approved',
            dateJoined: partner.createdAt ? new Date(partner.createdAt).toISOString().split('T')[0] : null,
          }));
          
          setApprovedPartners(mappedPartners);
        }
      } catch (err) {
        console.error('Error fetching approved partners:', err);
        setApprovedPartners([]);
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchApprovedPartners();
  }, []);

  // Stats data from API
  const statsData = useMemo(() => {
    if (!analyticsData?.overview) return [];

    const overview = analyticsData.overview;
    return [
      {
        title: t('dashboard.admin.stats.totalListings'),
        value: overview.totalProperties || 0,
        icon: Building2,
        variant: 'primary',
      },
      {
        title: t('dashboard.admin.stats.newUsers'),
        value: overview.totalUsers || 0,
        icon: Users,
        variant: 'success',
      },
      {
        title: t('dashboard.admin.stats.pendingVerifications'),
        value: overview.totalInquiries || 0,
        icon: ClipboardList,
        variant: 'info',
      },
      {
        title: t('dashboard.admin.stats.activeConciergeRequests'),
        value: overview.totalMessages || 0,
        icon: MessageSquare,
        variant: 'warning',
      },
    ];
  }, [analyticsData, t]);

  const propertiesData = useMemo(() => {
    if (!analyticsData?.recent?.properties) return [];

    return analyticsData.recent.properties.map(prop => ({
      id: prop.id,
      title: prop.title,
      city: prop.city || 'N/A',
      state: prop.state || 'N/A',
      price: prop.price || 0,
      propertyType: prop.propertyType || 'N/A',
      type: prop.listingType?.toLowerCase() || 'buy',
      typeLabel: prop.listingType === 'RENT'
        ? t('dashboard.admin.propertiesTable.types.rent')
        : t('dashboard.admin.propertiesTable.types.buy'),
      status: prop.status?.toLowerCase() || 'pending',
      statusLabel: prop.status === 'AVAILABLE'
        ? t('dashboard.admin.propertiesTable.statuses.approved')
        : prop.status === 'PENDING'
          ? t('dashboard.admin.propertiesTable.statuses.pending')
          : t('dashboard.admin.propertiesTable.statuses.rejected'),
      agent: `${prop.owner?.firstName || ''} ${prop.owner?.lastName || ''}`.trim() || 'Unknown',
      dateAdded: prop.createdAt ? new Date(prop.createdAt).toISOString().split('T')[0] : '',
      image: prop.images?.[0] ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${prop.images[0]}` : null,
    }));
  }, [analyticsData, t]);

  const usersData = useMemo(() => {
    if (!analyticsData?.recent?.users) return [];

    return analyticsData.recent.users.map(user => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
      email: user.email,
      role: user.role?.toLowerCase() || 'user',
      roleLabel: user.role === 'USER' ? 'User'
        : user.role === 'PARTNER' ? 'Partner'
          : user.role === 'AGENT' ? 'Agent'
            : user.role === 'SUPER_ADMIN' ? 'Super Admin'
              : user.role || 'User',
      dateJoined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
    }));
  }, [analyticsData]);

  const inquiriesData = useMemo(() => {
    if (!analyticsData?.recent?.inquiries) return [];

    return analyticsData.recent.inquiries.map(inquiry => ({
      id: inquiry.id,
      userName: `${inquiry.user?.firstName || ''} ${inquiry.user?.lastName || ''}`.trim() || 'Unknown',
      userEmail: inquiry.user?.email || '',
      propertyTitle: inquiry.property?.title || null,
      propertyCity: inquiry.property?.city || null,
      message: inquiry.message || '',
      status: inquiry.status?.toLowerCase() || 'pending',
      statusLabel: inquiry.status === 'PENDING' ? 'Pending'
        : inquiry.status === 'RESPONDED' ? 'Responded'
          : inquiry.status === 'CLOSED' ? 'Closed'
            : inquiry.status || 'Pending',
      date: inquiry.createdAt ? new Date(inquiry.createdAt).toISOString().split('T')[0] : '',
    }));
  }, [analyticsData]);

  // Mock engagement data for the chart
  const engagementData = [45, 62, 58, 72, 55, 48, 68, 75, 42, 58, 78, 85];

  // Get properties table translations object
  const propertiesTableTranslations = useMemo(() => {
    return {
      table: {
        propertyTitle: t('dashboard.admin.propertiesTable.table.propertyTitle'),
        type: t('dashboard.admin.propertiesTable.table.type'),
        status: t('dashboard.admin.propertiesTable.table.status'),
        agent: t('dashboard.admin.propertiesTable.table.agent'),
        dateAdded: t('dashboard.admin.propertiesTable.table.dateAdded'),
        actions: t('dashboard.admin.propertiesTable.table.actions'),
      },
      types: {
        buy: t('dashboard.admin.propertiesTable.types.buy'),
        rent: t('dashboard.admin.propertiesTable.types.rent'),
      },
      statuses: {
        approved: t('dashboard.admin.propertiesTable.statuses.approved'),
        pending: t('dashboard.admin.propertiesTable.statuses.pending'),
        rejected: t('dashboard.admin.propertiesTable.statuses.rejected'),
      },
      actions: {
        edit: t('dashboard.admin.propertiesTable.actions.edit'),
      },
    };
  }, [t]);

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

  // Pagination
  const totalPages = Math.ceil(propertiesData.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return propertiesData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [propertiesData, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Dashboard Overview</h1>
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900'>Dashboard Overview</h1>
        </div>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600'>Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  } 

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-4xl font-bold text-gray-900 '>Dashboard Overview</h1>
      </div>
      {/* Stats Grid */}
      <div className='grid gap-6 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4'>
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* User Engagement Chart */}
      {/* <UserEngagementChart
        title={t('dashboard.admin.performance.title')}
        subtitle={t('dashboard.admin.performance.subtitle')}
        period={t('dashboard.admin.performance.period')}
        change={t('dashboard.admin.performance.change')}
        weeks={[
          t('dashboard.admin.performance.weeks.week1'),
          t('dashboard.admin.performance.weeks.week2'),
          t('dashboard.admin.performance.weeks.week3'),
          t('dashboard.admin.performance.weeks.week4'),
        ]}
        data={engagementData}
      /> */}

      {/* Properties Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <PropertiesTable
          title={t('dashboard.admin.propertiesTable.title')}
          addButtonText={t('dashboard.admin.propertiesTable.addProperty')}
          properties={paginatedProperties}
          translations={propertiesTableTranslations}
          locale={locale}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={propertiesData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          translations={paginationTranslations}
        />
      </div>

      {/* Users Table */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <RecentUserTable
          title='Recent Users'
          users={usersData.slice(0, 5)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={propertiesData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          translations={paginationTranslations}
        />
      </div>

      {/* Approved Partners Table */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        {partnersLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]'></div>
          </div>
        ) : (
          <>
            <ApprovedPartnersTable
              title='Approved Partners'
              partners={approvedPartners.slice(0, 5)}
            />
            {approvedPartners.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(approvedPartners.length / ITEMS_PER_PAGE)}
                totalItems={approvedPartners.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
                translations={paginationTranslations}
              />
            )}
          </>
        )}
      </div>

      {/* Inquiries Table */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <InquiriesTable
          title='Recent Inquiries'
          inquiries={inquiriesData.slice(0, 5)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={propertiesData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          translations={paginationTranslations}
        />
      </div>
    </div>
  );
}
