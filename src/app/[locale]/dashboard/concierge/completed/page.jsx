'use client';

import { use, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import Pagination from '@/components/dashboard/Pagination';
import {
  CheckCircle,
  DollarSign,
  Star,
  Calendar,
  Search,
  Eye,
  Download,
} from 'lucide-react';

export default function ConciergeCompletedPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock completed jobs
  const [completedJobs, setCompletedJobs] = useState([
    {
      id: 'J-005',
      serviceType: 'Airport Pickup',
      clientName: 'Robert Johnson',
      completedDate: '2026-01-10T16:00:00Z',
      amount: 120,
      currency: 'USD',
      rating: 5,
      review: 'Excellent service! Very professional and punctual.',
      paymentStatus: 'paid',
    },
    {
      id: 'J-006',
      serviceType: 'Cleaning Services',
      clientName: 'Maria Garcia',
      completedDate: '2026-01-09T14:30:00Z',
      amount: 350,
      currency: 'USD',
      rating: 5,
      review: 'Amazing deep cleaning. Highly recommend!',
      paymentStatus: 'paid',
    },
    {
      id: 'J-007',
      serviceType: 'Document Translation',
      clientName: 'Wei Zhang',
      completedDate: '2026-01-08T11:00:00Z',
      amount: 200,
      currency: 'USD',
      rating: 4,
      review: 'Good translation quality. Delivered on time.',
      paymentStatus: 'paid',
    },
    {
      id: 'J-008',
      serviceType: 'Property Viewing',
      clientName: 'Sarah Williams',
      completedDate: '2026-01-07T10:00:00Z',
      amount: 80,
      currency: 'USD',
      rating: 5,
      review: 'Very helpful and knowledgeable. Made the process easy.',
      paymentStatus: 'pending',
    },
  ]);

  // Filter
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return completedJobs;
    const query = searchTerm.toLowerCase();
    return completedJobs.filter(
      (j) =>
        j.id.toLowerCase().includes(query) ||
        j.clientName.toLowerCase().includes(query) ||
        j.serviceType.toLowerCase().includes(query)
    );
  }, [completedJobs, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  // Stats
  const stats = useMemo(() => {
    const total = completedJobs.length;
    const thisMonth = completedJobs.filter((j) => {
      const date = new Date(j.completedDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const totalRevenue = completedJobs.reduce((sum, j) => sum + j.amount, 0);
    const avgRating =
      total > 0
        ? (completedJobs.reduce((sum, j) => sum + j.rating, 0) / total).toFixed(1)
        : 0;

    return { total, thisMonth, totalRevenue, avgRating };
  }, [completedJobs]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Completed Services</h1>
        <p className="text-sm text-gray-700 mt-2">
          View your service history and client reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Completed" value={stats.total} icon={CheckCircle} />
        <StatsCard title="This Month" value={stats.thisMonth} icon={Calendar} />
        <StatsCard title="Total Revenue (USD)" value={stats.totalRevenue} icon={DollarSign} />
        <StatsCard title="Avg Rating" value={stats.avgRating} icon={Star} />
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search completed jobs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
          />
        </div>
      </div>

      {/* Completed Jobs List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {job.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {job.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(job.completedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {job.currency} {job.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderStars(job.rating)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {job.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedJobs.length === 0 && (
            <div className="py-12 text-center text-gray-500">No completed jobs found</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
