'use client';

import { memo, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  X,
  User,
} from 'lucide-react';

const ConciergeRequestsTable = memo(({ requests, translations }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseRequest = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: translations.status.pending,
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: AlertCircle,
        label: translations.status.inProgress,
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: translations.status.completed,
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: translations.status.cancelled,
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

  const getPriorityBadge = (priority) => {
    const badges = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: translations.priority.high,
      },
      medium: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: translations.priority.medium,
      },
      low: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: translations.priority.low,
      },
    };

    const badge = badges[priority] || badges.medium;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
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
          <h2 className='text-xl font-bold text-gray-900'>All Concierges</h2>
        </div>
      </div>
      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.requestId}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.client}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.service}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.property}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.priority}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.status}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.requestDate}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {requests.map((request) => (
              <tr
                key={request.id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    #{request.id.toString().padStart(4, '0')}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-col'>
                    <div className='text-sm font-medium text-gray-900'>
                      {request.client_name}
                    </div>
                    <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                      <Mail className='h-3 w-3' />
                      {request.client_email}
                    </div>
                    {request.client_phone && (
                      <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                        <Phone className='h-3 w-3' />
                        {request.client_phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-900'>
                    {request.service_type}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  {request.property_address ? (
                    <div className='flex items-start gap-1 text-sm text-gray-600'>
                      <MapPin className='h-4 w-4 shrink-0 mt-0.5' />
                      <span className='line-clamp-2'>
                        {request.property_address}
                      </span>
                    </div>
                  ) : (
                    <span className='text-sm text-gray-400'>N/A</span>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getPriorityBadge(request.priority)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(request.status)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(request.created_at)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleViewRequest(request)}
                      className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title={translations.table.view}
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden space-y-4'>
        {requests.map((request) => (
          <div
            key={request.id}
            className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'
          >
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='text-sm font-semibold text-gray-900'>
                  #{request.id.toString().padStart(4, '0')}
                </div>
                <div className='text-sm font-medium text-gray-700 mt-1'>
                  {request.service_type}
                </div>
              </div>
              <div className='flex flex-col items-end gap-1.5'>
                {getStatusBadge(request.status)}
                {getPriorityBadge(request.priority)}
              </div>
            </div>

            {/* Client Info */}
            <div className='space-y-1.5 pt-2 border-t border-gray-100'>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-gray-400 shrink-0' />
                <span className='font-medium text-gray-900'>
                  {request.client_name}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Mail className='h-4 w-4 text-gray-400 shrink-0' />
                <span className='truncate'>{request.client_email}</span>
              </div>
              {request.client_phone && (
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Phone className='h-4 w-4 text-gray-400 shrink-0' />
                  <span>{request.client_phone}</span>
                </div>
              )}
            </div>

            {/* Property */}
            {request.property_address && (
              <div className='flex items-start gap-2 text-sm text-gray-600 pt-2 border-t border-gray-100'>
                <MapPin className='h-4 w-4 text-gray-400 shrink-0 mt-0.5' />
                <span className='line-clamp-2'>{request.property_address}</span>
              </div>
            )}

            {/* Footer */}
            <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
              <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                <Calendar className='h-3.5 w-3.5' />
                {formatDate(request.created_at)}
              </div>
              <button onClick={() => handleViewRequest(request)} className='px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5'>
                <Eye className='h-4 w-4' />
                {translations.table.view}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40' onClick={handleCloseRequest} />

          <div className='relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between px-6 py-4 border-b'>
              <div className='flex items-center gap-4'>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-700'>
                  <Calendar className='h-5 w-5' />
                </span>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Request #{selectedRequest.id}</h3>
                  <div className='text-sm text-gray-500'>
                    {selectedRequest.service_type} • {formatDate(selectedRequest.created_at)}
                  </div>
                </div>
              </div>
              <div>
                <button onClick={handleCloseRequest} className='p-2 rounded-full hover:bg-gray-100'>
                  <X className='h-5 w-5 text-gray-700' />
                </button>
              </div>
            </div>

            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-1 gap-3'>
                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500'>Client</div>
                  <div className='font-medium text-gray-900'>{selectedRequest.client_name}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500'>Email</div>
                  <div className='font-medium text-gray-900'>{selectedRequest.client_email}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500'>Phone</div>
                  <div className='font-medium text-gray-900'>{selectedRequest.client_phone || '—'}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500'>Service</div>
                  <div className='font-medium text-gray-900'>{selectedRequest.service_type}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500'>Property</div>
                  <div className='font-medium text-gray-900'>{selectedRequest.property_address || '—'}</div>
                </div>

                <div className='flex justify-between items-center gap-4'>
                  <div className='text-sm text-gray-500'>Priority</div>
                  <div>{getPriorityBadge(selectedRequest.priority)}</div>
                </div>

                <div className='flex justify-between items-center gap-4'>
                  <div className='text-sm text-gray-500'>Status</div>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ConciergeRequestsTable.displayName = 'ConciergeRequestsTable';

export default ConciergeRequestsTable;
