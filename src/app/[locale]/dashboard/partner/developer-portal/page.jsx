'use client';

import { useState } from 'react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import {
  Building2,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

/**
 * Developer Portal Page
 * Production-grade component for managing developer projects and listings
 * Following SOLID principles, optimized for performance and accessibility
 */
export default function DeveloperPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - In production, this would come from API
  const projects = [
    {
      id: 1,
      name: 'Luxury Residence Complex',
      location: 'Cocody, Abidjan',
      units: 24,
      sold: 18,
      revenue: '2,400,000',
      status: 'active',
      lastUpdated: '2024-11-08',
    },
    {
      id: 2,
      name: 'Modern Villas Estate',
      location: 'Plateau, Abidjan',
      units: 12,
      sold: 8,
      revenue: '1,800,000',
      status: 'active',
      lastUpdated: '2024-11-07',
    },
    {
      id: 3,
      name: 'Waterfront Apartments',
      location: 'Marcory, Abidjan',
      units: 36,
      sold: 36,
      revenue: '3,600,000',
      status: 'completed',
      lastUpdated: '2024-10-15',
    },
    {
      id: 4,
      name: 'Garden Heights',
      location: 'Yopougon, Abidjan',
      units: 18,
      sold: 5,
      revenue: '450,000',
      status: 'pending',
      lastUpdated: '2024-11-09',
    },
  ];

  const stats = [
    {
      title: 'Total Projects',
      value: 12,
      trend: '+2 this month',
      variant: 'primary',
    },
    {
      title: 'Active Listings',
      value: 90,
      trend: '+15 this week',
      variant: 'success',
    },
    {
      title: 'Units Sold',
      value: 247,
      trend: '+32 this month',
      variant: 'info',
    },
    {
      title: 'Total Revenue',
      value: '8.2M',
      trend: '+18%',
      variant: 'warning',
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'Active',
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: 'Pending',
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: CheckCircle,
        label: 'Completed',
      },
      inactive: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: XCircle,
        label: 'Inactive',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className='h-3.5 w-3.5' aria-hidden='true' />
        {config.label}
      </span>
    );
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='rounded-lg bg-white p-6 shadow-sm border border-gray-200'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
              Developer Portal
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Manage your development projects and track performance
            </p>
          </div>
          <button
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-[#0F1B2E] transition-colors hover:bg-[#d4a520] focus:outline-none focus:ring-2 focus:ring-[#E6B325] focus:ring-offset-2'
            aria-label='Add new project'
          >
            <Plus className='h-4 w-4' aria-hidden='true' />
            Add New Project
          </button>
        </div>
      </div>

      {/* Stats Grid - Using Admin StatsCard */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
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
      <div className='rounded-lg bg-white p-6 shadow-sm border border-gray-200'>
        <h2 className='mb-4 text-lg font-semibold text-gray-900'>
          Quick Actions
        </h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <Upload className='h-5 w-5 text-[#E6B325]' aria-hidden='true' />
            <span className='text-sm font-medium text-gray-900'>
              Upload Project
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
          <button className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#E6B325] hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'>
            <Download className='h-5 w-5 text-[#E6B325]' aria-hidden='true' />
            <span className='text-sm font-medium text-gray-900'>
              Export Data
            </span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className='rounded-lg bg-white shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200 p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>My Projects</h2>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              {/* Search */}
              <div className='relative flex-1 sm:w-64'>
                <Search
                  className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                  aria-hidden='true'
                />
                <input
                  type='text'
                  placeholder='Search projects...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]'
                  aria-label='Search projects'
                />
              </div>

              {/* Filter */}
              <div className='relative'>
                <Filter
                  className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                  aria-hidden='true'
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto'
                  aria-label='Filter by status'
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='pending'>Pending</option>
                  <option value='completed'>Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className='hidden overflow-x-auto lg:block'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Project Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Units
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Revenue
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Last Updated
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className='transition-colors hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>
                    <div className='font-medium text-gray-900'>
                      {project.name}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-600'>
                      {project.location}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm'>
                      <span className='font-medium text-gray-900'>
                        {project.sold}
                      </span>
                      <span className='text-gray-500'>/{project.units}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      ${project.revenue}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    {getStatusBadge(project.status)}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-600'>
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        className='rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'
                        title='View project'
                        aria-label='View project'
                      >
                        <Eye className='h-4 w-4 text-gray-600' />
                      </button>
                      <button
                        className='rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E6B325]'
                        title='Edit project'
                        aria-label='Edit project'
                      >
                        <Edit className='h-4 w-4 text-[#E6B325]' />
                      </button>
                      <button
                        className='rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                        title='Delete project'
                        aria-label='Delete project'
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='divide-y divide-gray-200 lg:hidden'>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className='p-4 transition-colors hover:bg-gray-50'
            >
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                  <h3 className='font-medium text-gray-900'>{project.name}</h3>
                  <p className='mt-1 text-sm text-gray-600'>
                    {project.location}
                  </p>
                </div>
                <button
                  className='rounded p-1.5 transition-colors hover:bg-gray-100'
                  aria-label='More options'
                >
                  <MoreVertical className='h-4 w-4 text-gray-600' />
                </button>
              </div>

              <div className='mb-3 grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <span className='text-gray-500'>Units Sold:</span>
                  <span className='ml-2 font-medium text-gray-900'>
                    {project.sold}/{project.units}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Revenue:</span>
                  <span className='ml-2 font-medium text-gray-900'>
                    ${project.revenue}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                {getStatusBadge(project.status)}
                <div className='flex items-center gap-2'>
                  <button
                    className='rounded p-1.5 transition-colors hover:bg-gray-100'
                    title='View'
                  >
                    <Eye className='h-4 w-4 text-gray-600' />
                  </button>
                  <button
                    className='rounded p-1.5 transition-colors hover:bg-gray-100'
                    title='Edit'
                  >
                    <Edit className='h-4 w-4 text-[#E6B325]' />
                  </button>
                  <button
                    className='rounded p-1.5 transition-colors hover:bg-gray-100'
                    title='Delete'
                  >
                    <Trash2 className='h-4 w-4 text-red-600' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className='px-6 py-12 text-center'>
            <Building2 className='mx-auto h-12 w-12 text-gray-300' />
            <h3 className='mt-3 text-sm font-medium text-gray-900'>
              No projects found
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating a new project'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
