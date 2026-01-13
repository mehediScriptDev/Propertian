'use client';

import { memo } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  MapPin,
} from 'lucide-react';

/**
 * SponsorApplicationsTable - Table component for displaying sponsor applications
 */
const SponsorApplicationsTable = memo(({ applications, translations, onView, onApprove, onReject, loading = false }) => {
  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium text-gray-700">Loading applications...</p>
        </div>
      </div>
    );
  }

  // Status badge styling - keeping existing design
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Calendar,
        label: 'Pending',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'Approved',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'Rejected',
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className='h-3.5 w-3.5' />
        {badge.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>All Applications</h2>
        </div>
      </div>

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Company / Brand
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Contact Person
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Email
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Country
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Applied Date
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {applications.map((application) => (
              <tr
                key={application.id}
                className='hover:bg-gray-50 transition-colors'
              >
                {/* Company Name */}
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {application.company_name}
                  </div>
                </td>

                {/* Contact Person */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-900'>
                      {application.contact_person}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-900'>
                      {application.email}
                    </span>
                  </div>
                </td>

                {/* Country */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-900'>
                      {application.country}
                    </span>
                  </div>
                </td>

                {/* Applied Date */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(application.applied_date)}
                  </div>
                </td>

                {/* Status Badge */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(application.status)}
                </td>

                {/* Actions */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2'>
                    {/* View */}
                    <button
                      onClick={() => onView(application)}
                      className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title='View Details'
                    >
                      <Eye className='h-4 w-4' />
                    </button>

                    {/* Approve - only show for pending applications */}
                    {application.status === 'pending' && (
                      <button
                        onClick={() => onApprove(application)}
                        className='p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                        title='Approve'
                      >
                        <CheckCircle className='h-4 w-4' />
                      </button>
                    )}

                    {/* Reject - only show for pending applications */}
                    {application.status === 'pending' && (
                      <button
                        onClick={() => onReject(application)}
                        className='p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Reject'
                      >
                        <XCircle className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden space-y-4 p-4'>
        {applications.map((application) => (
          <div
            key={application.id}
            className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'
          >
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='text-sm font-semibold text-gray-900'>
                  {application.company_name}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {application.contact_person}
                </div>
              </div>
              {getStatusBadge(application.status)}
            </div>

            {/* Details */}
            <div className='space-y-1.5 pt-2 border-t border-gray-100 text-sm'>
              <div className='flex items-center gap-2 text-gray-600'>
                <Mail className='h-4 w-4 text-gray-400' />
                {application.email}
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <MapPin className='h-4 w-4 text-gray-400' />
                {application.country}
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <Calendar className='h-4 w-4 text-gray-400' />
                {formatDate(application.applied_date)}
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
              <button 
                onClick={() => onView(application)} 
                className='flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5'
              >
                <Eye className='h-4 w-4' />
                View
              </button>

              {application.status === 'pending' && (
                <>
                  <button 
                    onClick={() => onApprove(application)} 
                    className='px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors' 
                    title='Approve'
                  >
                    <CheckCircle className='h-4 w-4' />
                  </button>

                  <button 
                    onClick={() => onReject(application)} 
                    className='px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors' 
                    title='Reject'
                  >
                    <XCircle className='h-4 w-4' />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SponsorApplicationsTable.displayName = 'SponsorApplicationsTable';

export default SponsorApplicationsTable;
