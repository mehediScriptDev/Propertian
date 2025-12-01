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
  Edit,
  Trash2,
} from 'lucide-react';

import RequestDetailsModal from './RequestDetailsModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ConciergeRequestsTable = memo(({ requests, translations, onEdit, onDelete }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request) => {
    if (typeof onEdit === 'function') {
      onEdit(request);
      return;
    }

    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (request) => {
    // Open a confirm modal instead of using window.confirm()
    setDeleteTarget(request);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (typeof onDelete === 'function') {
      onDelete(deleteTarget.id);
    } else {
      // eslint-disable-next-line no-alert
      alert('Delete handler not provided. Implement `onDelete` prop to enable deletion.');
    }

    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
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
              {/* <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.priority}
              </th> */}
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
                {/* <td className='px-6 py-4 whitespace-nowrap'>
                  {getPriorityBadge(request.priority)}
                </td> */}
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
                  <div className='flex items-center gap-2  pl-4'>
                    <button
                      onClick={() => handleViewRequest(request)}
                      className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title={translations.table.view}
                    >
                      <Eye className='h-4 w-4' />
                    </button>

                    <button
                      onClick={() => handleEditRequest(request)}
                      className='p-1.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
                      title={translations.table.edit || 'Edit'}
                    >
                      <Edit className='h-4 w-4' />
                    </button>

                    <button
                      onClick={() => handleDeleteRequest(request)}
                      className='p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title={translations.table.delete || 'Delete'}
                    >
                      <Trash2 className='h-4 w-4' />
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
              <div className='flex items-center gap-2'>
                <button onClick={() => handleViewRequest(request)} className='px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5'>
                  <Eye className='h-4 w-4' />
                  {translations.table.view}
                </button>

                <button onClick={() => handleEditRequest(request)} className='p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors' title={translations.table.edit || 'Edit'}>
                  <Edit className='h-4 w-4' />
                </button>

                <button onClick={() => handleDeleteRequest(request)} className='p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors' title={translations.table.delete || 'Delete'}>
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RequestDetailsModal open={isModalOpen} request={selectedRequest} onClose={handleCloseRequest} />
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        message={'Are you sure you want to delete this request?'}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
});

ConciergeRequestsTable.displayName = 'ConciergeRequestsTable';

export default ConciergeRequestsTable;
