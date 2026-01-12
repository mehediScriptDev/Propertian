"use client";

import { use, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import Pagination from '@/components/dashboard/Pagination';
import {
  Briefcase,
  Clock,
  CheckCircle,
  TrendingUp,
  User,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export default function ConciergeJobsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // Mock active jobs data with status workflow
  const [activeJobs, setActiveJobs] = useState([
    {
      id: 'J-001',
      requestId: 'SR-2398',
      clientName: 'David Thompson',
      clientEmail: 'david.t@email.com',
      clientPhone: '+1 234 567 8900',
      serviceType: 'Utility Setup',
      propertyAddress: '123 Main St, Queens, NY 11375',
      amount: 250,
      currency: 'USD',
      status: 'Assigned',
      startDate: '2026-01-11',
      dueDate: '2026-01-14',
    },
    {
      id: 'J-002',
      requestId: 'SR-2405',
      clientName: 'Lisa Anderson',
      clientEmail: 'lisa.a@email.com',
      clientPhone: '+1 234 567 8905',
      serviceType: 'Property Maintenance',
      propertyAddress: '456 Oak Ave, Brooklyn, NY 11201',
      amount: 450,
      currency: 'USD',
      status: 'In Review',
      startDate: '2026-01-12',
      dueDate: '2026-01-16',
    },
    {
      id: 'J-003',
      requestId: 'SR-2411',
      clientName: 'Michael Chen',
      clientEmail: 'michael.c@email.com',
      clientPhone: '+1 234 567 8912',
      serviceType: 'Home Inspection',
      propertyAddress: '789 Park Ave, Manhattan, NY 10021',
      amount: 350,
      currency: 'USD',
      status: 'Scheduled',
      startDate: '2026-01-13',
      dueDate: '2026-01-15',
    },
    {
      id: 'J-004',
      requestId: 'SR-2387',
      clientName: 'Sarah Williams',
      clientEmail: 'sarah.w@email.com',
      clientPhone: '+1 234 567 8888',
      serviceType: 'Moving Services',
      propertyAddress: '321 Broadway, Queens, NY 11377',
      amount: 800,
      currency: 'USD',
      status: 'New',
      startDate: '2026-01-15',
      dueDate: '2026-01-18',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      'New': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      'In Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'Assigned': { bg: 'bg-purple-100', text: 'text-purple-800', icon: User },
      'Scheduled': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Clock },
      'Completed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    };
    const config = statusConfig[status] || statusConfig['New'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className='h-3.5 w-3.5' />
        {status}
      </span>
    );
  };

  // Handle status change
  const handleStatusChange = (jobId, newStatus) => {
    setActiveJobs(prev => 
      prev.map(job => job.id === jobId ? { ...job, status: newStatus } : job)
    );
  };

  // Stats
  const stats = useMemo(() => {
    const total = activeJobs.length;
    const newJobs = activeJobs.filter(j => j.status === 'New').length;
    const scheduled = activeJobs.filter(j => j.status === 'Scheduled').length;
    const revenue = activeJobs.reduce((sum, j) => sum + j.amount, 0);

    return { total, newJobs, scheduled, revenue };
  }, [activeJobs]);

  // Pagination
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activeJobs, currentPage]);

  const totalPages = Math.ceil(activeJobs.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Active Jobs</h1>
        <p className="text-sm text-gray-700 mt-2">
          Manage your service jobs with real-time status tracking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Jobs" value={stats.total} icon={Briefcase} />
        <StatsCard title="New Jobs" value={stats.newJobs} icon={Clock} />
        <StatsCard title="Scheduled" value={stats.scheduled} icon={TrendingUp} />
        {/* <StatsCard title="Revenue (USD)" value={`$${stats.revenue}`} icon={CheckCircle} /> */}
      </div>

      {/* Jobs Table */}
      <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Job ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Service Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{job.id}</div>
                    <div className="text-xs text-gray-500">{job.requestId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{job.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{job.clientName}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {job.clientEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {job.clientPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{job.propertyAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {job.currency} ${job.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{job.dueDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
                        ${job.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${job.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${job.status === 'Assigned' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                        ${job.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                        ${job.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {paginatedJobs.map((job) => (
            <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{job.id}</h3>
                  <div className="text-sm text-gray-600">{job.serviceType}</div>
                </div>
                {getStatusBadge(job.status)}
              </div>

              <div className="space-y-2 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{job.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{job.clientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{job.clientPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">{job.propertyAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">{job.currency} ${job.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Due:</span>
                  <span className="text-gray-900">{job.dueDate}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Update Status:</label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${job.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${job.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${job.status === 'Assigned' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    ${job.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                    ${job.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {activeJobs.length === 0 && (
          <div className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Jobs</h3>
            <p className="text-sm text-gray-600">
              Your active jobs will appear here once quotes are accepted
            </p>
          </div>
        )}

        {/* Pagination */}
        {activeJobs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={activeJobs.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            translations={{
              previous: 'Previous',
              next: 'Next',
              showing: 'Showing',
              to: 'to',
              of: 'of',
              results: 'results',
            }}
          />
        )}
      </div>
    </div>
  );
}
