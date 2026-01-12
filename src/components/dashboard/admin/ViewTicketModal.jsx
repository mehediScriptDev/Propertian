'use client';

import { X } from 'lucide-react';

/**
 * ViewTicketModal - Read-only modal showing full ticket details
 * @param {boolean} open - Whether modal is visible
 * @param {object} ticket - The ticket to display
 * @param {function} onClose - Close handler
 */
export default function ViewTicketModal({ open, ticket, onClose }) {
  if (!open || !ticket) return null;

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
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'info-requested': 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Priority badge styling
  const getPriorityStyle = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket Details
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
          {/* Ticket ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ticket ID</p>
              <p className="text-lg font-semibold text-gray-900">#{ticket.id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(ticket.status)}`}>
                {ticket.status?.toUpperCase().replace(/-/g, ' ')}
              </span>
              {ticket.priority && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityStyle(ticket.priority)}`}>
                  {ticket.priority?.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">User Name</h3>
              <p className="text-base text-gray-900">{ticket.user_name || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
              <p className="text-base text-gray-900">{ticket.user_email || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
              <p className="text-base text-gray-900">{ticket.user_phone || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Service Type</h3>
              <p className="text-base text-gray-900">{ticket.service_type || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
              <p className="text-base text-gray-900">
                {ticket.assigned_to === 'internal' && 'Internal Concierge'}
                {ticket.assigned_to === 'partner' && 'Concierge Partner'}
                {ticket.assigned_to === 'unassigned' && 'Unassigned'}
                {!ticket.assigned_to && 'Unassigned'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
              <p className="text-base text-gray-900">{formatDate(ticket.created_at)}</p>
            </div>
          </div>

          {/* Property Address (Full Width) */}
          {ticket.property_address && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Property Address</h3>
              <p className="text-base text-gray-900">{ticket.property_address}</p>
            </div>
          )}

          {/* Description (Full Width) */}
          {ticket.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>
          )}

          {/* Property Image */}
          {ticket.image_url && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Property Image</h3>
              <img
                src={ticket.image_url}
                alt="Property"
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
