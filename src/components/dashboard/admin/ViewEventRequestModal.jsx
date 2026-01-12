'use client';

import { X } from 'lucide-react';

/**
 * ViewEventRequestModal - Read-only modal showing full event request details
 * @param {boolean} open - Whether modal is visible
 * @param {object} eventRequest - The event request to display
 * @param {function} onClose - Close handler
 */
export default function ViewEventRequestModal({ open, eventRequest, onClose }) {
  if (!open || !eventRequest) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status badge styling (keeping existing design)
  const getStatusStyle = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      in_review: 'bg-purple-100 text-purple-800',
      need_changes: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      live: 'bg-emerald-100 text-emerald-800',
      ended: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Event Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Event ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Request ID</p>
              <p className="text-lg font-semibold text-gray-900">#{eventRequest.id}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(eventRequest.status)}`}>
              {eventRequest.status?.toUpperCase().replace(/_/g, ' ')}
            </span>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Event Title</h3>
              <p className="text-lg font-semibold text-gray-900">{eventRequest.event_title || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Sponsor Name</h3>
              <p className="text-base text-gray-900">{eventRequest.sponsor_name || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Event Type</h3>
              <p className="text-base text-gray-900">{eventRequest.event_type || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Requested Date</h3>
              <p className="text-base text-gray-900">{formatDate(eventRequest.requested_date)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Submitted On</h3>
              <p className="text-base text-gray-900">{formatDate(eventRequest.submitted_date)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Location / Platform</h3>
              <p className="text-base text-gray-900">{eventRequest.location || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Expected Attendees</h3>
              <p className="text-base text-gray-900">{eventRequest.expected_attendees || 'N/A'}</p>
            </div>
          </div>

          {/* Event Description (Full Width) */}
          {eventRequest.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Event Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {eventRequest.description}
                </p>
              </div>
            </div>
          )}

          {/* Target Audience */}
          {eventRequest.target_audience && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Target Audience</h3>
              <p className="text-base text-gray-900">{eventRequest.target_audience}</p>
            </div>
          )}

          {/* Cover Image */}
          {eventRequest.cover_image && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cover Image</h3>
              <img
                src={eventRequest.cover_image}
                alt="Event Cover"
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
