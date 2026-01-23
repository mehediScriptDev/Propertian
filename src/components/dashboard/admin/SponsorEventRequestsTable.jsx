'use client';

import { memo } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Play,
  Users,
} from 'lucide-react';

/**
 * SponsorEventRequestsTable - Table component for displaying sponsor event requests
 */
const SponsorEventRequestsTable = memo(({ eventRequests, translations, onView, onApprove, onGoLive, onReject, loading = false }) => {
  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium text-gray-700">Loading event requests...</p>
        </div>
      </div>
    );
  }

  // Status badge styling - keeping existing design
  const getStatusBadge = (status) => {
    const badges = {
      new: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: Calendar,
        label: 'New',
      },
      in_review: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: Eye,
        label: 'In Review',
      },
      need_changes: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: XCircle,
        label: 'Need Changes',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'Approved',
      },
      live: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        icon: Play,
        label: 'Live',
      },
      ended: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: Calendar,
        label: 'Ended',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'Rejected',
      },
    };

    const badge = badges[status] || badges.new;
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
          <h2 className='text-xl font-bold text-gray-900'>All Event Requests</h2>
        </div>
      </div>

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[1000px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Event Title
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Sponsor Name
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Event Type
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Requested Date
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Location
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
            {eventRequests.map((event) => (
              <tr
                key={event.id}
                className='hover:bg-gray-50 transition-colors'
              >
                {/* Event Title */}
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {event.event_title}
                  </div>
                </td>

                {/* Sponsor Name */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-900'>
                      {event.sponsor_name}
                    </span>
                  </div>
                </td>

                {/* Event Type */}
                <td className='px-6 py-4'>
                  <span className='text-sm text-gray-900'>
                    {event.event_type}
                  </span>
                </td>

                {/* Requested Date */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(event.requested_date)}
                  </div>
                </td>

                {/* Location */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-gray-400' />
                    <span className='text-sm text-gray-900 truncate max-w-[150px]'>
                      {event.location}
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(event.status)}
                </td>

                {/* Actions */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2'>
                    {/* View */}
                    <button
                      onClick={() => onView(event)}
                      className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title='View Details'
                    >
                      <Eye className='h-4 w-4' />
                    </button>

                    {/* Approve - only show for new/in_review/need_changes */}
                    {['new', 'in_review', 'need_changes'].includes(event.status) && (
                      <button
                        onClick={() => onApprove(event)}
                        className='p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                        title='Approve'
                      >
                        <CheckCircle className='h-4 w-4' />
                      </button>
                    )}

                    {/* Go Live - only show for approved events */}
                    {event.status === 'approved' && (
                      <button
                        onClick={() => onGoLive(event)}
                        className='p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors'
                        title='Go Live'
                      >
                        <Play className='h-4 w-4' />
                      </button>
                    )}

                    {/* Reject - only show for non-rejected/non-ended */}
                    {!['rejected', 'ended', 'live'].includes(event.status) && (
                      <button
                        onClick={() => onReject(event)}
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
        {eventRequests.map((event) => (
          <div
            key={event.id}
            className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'
          >
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='text-sm font-semibold text-gray-900'>
                  {event.event_title}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {event.sponsor_name}
                </div>
              </div>
              {getStatusBadge(event.status)}
            </div>

            {/* Details */}
            <div className='space-y-1.5 pt-2 border-t border-gray-100 text-sm'>
              <div className='flex items-center gap-2 text-gray-600'>
                <Calendar className='h-4 w-4 text-gray-400' />
                {event.event_type} • {formatDate(event.requested_date)}
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <MapPin className='h-4 w-4 text-gray-400' />
                {event.location}
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
              <button 
                onClick={() => onView(event)} 
                className='flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5'
              >
                <Eye className='h-4 w-4' />
                View
              </button>

              {['new', 'in_review', 'need_changes'].includes(event.status) && (
                <button 
                  onClick={() => onApprove(event)} 
                  className='px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors' 
                  title='Approve'
                >
                  <CheckCircle className='h-4 w-4' />
                </button>
              )}

              {event.status === 'approved' && (
                <button 
                  onClick={() => onGoLive(event)} 
                  className='px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors' 
                  title='Go Live'
                >
                  <Play className='h-4 w-4' />
                </button>
              )}

              {!['rejected', 'ended', 'live'].includes(event.status) && (
                <button 
                  onClick={() => onReject(event)} 
                  className='px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors' 
                  title='Reject'
                >
                  <XCircle className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SponsorEventRequestsTable.displayName = 'SponsorEventRequestsTable';

export default SponsorEventRequestsTable;
