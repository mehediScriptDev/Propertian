'use client';

import { X } from 'lucide-react';

/**
 * ViewApplicationModal - Read-only modal showing full sponsor application details
 * @param {boolean} open - Whether modal is visible
 * @param {object} application - The application to display
 * @param {function} onClose - Close handler
 */
export default function ViewApplicationModal({ open, application, onClose }) {
  if (!open || !application) return null;

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
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Application Details
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
          {/* Application ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Application ID</p>
              <p className="text-lg font-semibold text-gray-900">#{application.id}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(application.status)}`}>
              {application.status?.toUpperCase()}
            </span>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company/Brand Name */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Company / Brand Name</h3>
              <p className="text-base text-gray-900">{application.company_name || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Person</h3>
              <p className="text-base text-gray-900">{application.contact_person || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
              <p className="text-base text-gray-900">{application.email || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
              <p className="text-base text-gray-900">{application.phone || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Country</h3>
              <p className="text-base text-gray-900">{application.country || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Applied Date</h3>
              <p className="text-base text-gray-900">{formatDate(application.applied_date)}</p>
            </div>
          </div>

          {/* Business Description (Full Width) */}
          {application.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Business Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {application.description}
                </p>
              </div>
            </div>
          )}

          {/* Website */}
          {application.website && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Website</h3>
              <a 
                href={application.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base text-blue-600 hover:text-blue-800 underline"
              >
                {application.website}
              </a>
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
