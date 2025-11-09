'use client';

import { use, useMemo } from 'react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import {
  Building2,
  FileText,
  MessageSquare,
  Calendar,
  Eye,
  MapPin,
  DollarSign,
  Plus,
} from 'lucide-react';

export default function PartnerDashboardPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // Stats data matching admin dashboard style with SAME colors
  const statsData = useMemo(
    () => [
      {
        title: 'Total Properties',
        value: 12,
        trend: '+3 this month',
        variant: 'primary',
      },
      {
        title: 'Active Listings',
        value: 8,
        trend: '+2 this week',
        variant: 'success',
      },
      {
        title: 'Total Views',
        value: 1247,
        trend: '+18.5%',
        variant: 'info',
      },
      {
        title: 'New Inquiries',
        value: 5,
        trend: '+2 today',
        variant: 'warning',
      },
    ],
    []
  );

  // Recent properties data
  const recentProperties = useMemo(
    () => [
      {
        id: 1,
        title: 'Luxury Villa in Cocody',
        location: 'Cocody, Abidjan',
        price: '$450,000',
        views: 234,
        inquiries: 12,
        status: 'active',
      },
      {
        id: 2,
        title: 'Modern Apartment',
        location: 'Plateau, Abidjan',
        price: '$280,000',
        views: 189,
        inquiries: 8,
        status: 'active',
      },
      {
        id: 3,
        title: 'Beachfront Property',
        location: 'Grand-Bassam',
        price: '$620,000',
        views: 312,
        inquiries: 15,
        status: 'pending',
      },
    ],
    []
  );

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              Welcome Back, Partner
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Here&apos;s an overview of your property portfolio and recent
              activities
            </p>
          </div>
          <button className='inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-[#0F1B2E] transition-colors hover:bg-[#d4a520] focus:outline-none focus:ring-2 focus:ring-[#E6B325] focus:ring-offset-2'>
            <Plus className='h-4 w-4' aria-hidden='true' />
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats Grid - Using Admin StatsCard component */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-200'>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>
          Quick Actions
        </h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <Building2 className='h-5 w-5 text-[#E6B325]' aria-hidden='true' />
            <span className='text-sm font-medium text-gray-900'>
              Add Listing
            </span>
          </button>
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <MessageSquare
              className='h-5 w-5 text-[#E6B325]'
              aria-hidden='true'
            />
            <span className='text-sm font-medium text-gray-900'>
              View Inquiries
            </span>
          </button>
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <FileText className='h-5 w-5 text-[#E6B325]' aria-hidden='true' />
            <span className='text-sm font-medium text-gray-900'>
              Generate Report
            </span>
          </button>
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <Calendar className='h-5 w-5 text-[#E6B325]' aria-hidden='true' />
            <span className='text-sm font-medium text-gray-900'>
              Schedule Visit
            </span>
          </button>
        </div>
      </div>

      {/* Recent Properties */}
      <div className='rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden'>
        <div className='border-b border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Recent Properties
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                Your latest property listings
              </p>
            </div>
            <button className='text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors'>
              View All →
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className='hidden lg:block overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Property
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Views
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Inquiries
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {recentProperties.map((property) => (
                <tr
                  key={property.id}
                  className='transition-colors hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>
                    <div className='font-medium text-gray-900'>
                      {property.title}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <MapPin className='h-3.5 w-3.5 text-gray-400' />
                      {property.location}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-1 text-sm font-medium text-gray-900'>
                      <DollarSign className='h-3.5 w-3.5 text-gray-400' />
                      {property.price}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <Eye className='h-3.5 w-3.5 text-gray-400' />
                      {property.views}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <MessageSquare className='h-3.5 w-3.5 text-gray-400' />
                      {property.inquiries}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='divide-y divide-gray-200 lg:hidden'>
          {recentProperties.map((property) => (
            <div
              key={property.id}
              className='p-4 hover:bg-gray-50 transition-colors'
            >
              <div className='mb-3'>
                <h3 className='font-medium text-gray-900'>{property.title}</h3>
                <div className='mt-1 flex items-center gap-1 text-sm text-gray-600'>
                  <MapPin className='h-3.5 w-3.5 text-gray-400' />
                  {property.location}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 text-sm mb-3'>
                <div className='flex items-center gap-1 text-gray-600'>
                  <DollarSign className='h-3.5 w-3.5 text-gray-400' />
                  <span className='font-medium'>{property.price}</span>
                </div>
                <div className='flex items-center gap-1 text-gray-600'>
                  <Eye className='h-3.5 w-3.5 text-gray-400' />
                  {property.views} views
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    property.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {property.status === 'active' ? 'Active' : 'Pending'}
                </span>
                <div className='flex items-center gap-1 text-sm text-gray-600'>
                  <MessageSquare className='h-3.5 w-3.5 text-gray-400' />
                  {property.inquiries} inquiries
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
