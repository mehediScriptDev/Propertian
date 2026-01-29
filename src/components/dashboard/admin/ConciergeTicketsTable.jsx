'use client';

import { memo } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Trash2,
  UserPlus,
} from 'lucide-react';

/**
 * ConciergeTicketsTable - Table component for displaying concierge tickets
 * Displays ticket data with actions: View, Assign, Close
 */
const ConciergeTicketsTable = memo(({ tickets, translations, onView, onAssign, onClose, loading = false }) => {
  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium text-gray-700">Loading tickets...</p>
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
        icon: Clock,
        label: "Pending",
      },
      assigned: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: UserPlus,
        label: "Assigned",
      },
      'in-progress': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: AlertCircle,
        label: "In Progress",
      },
      'info-requested': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: AlertCircle,
        label: "Info Requested",
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: "Cancelled",
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

  // Priority badge styling - keeping existing design
  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    
    const badges = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: "High",
      },
      medium: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: "Medium",
      },
      low: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: "Low",
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get assigned status label
  const getAssignedLabel = (assignedTo) => {
    if (assignedTo === 'internal') return 'Internal';
    if (assignedTo === 'partner') return 'Partner';
    return 'Unassigned';
  };

  return (
    <div>
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>All Tickets</h2>
        </div>
      </div>

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                TicketID
              </th>
              <th className='px-6 py-4 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                User Name
              </th>
              <th className='px-6 py-4 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Service Type
              </th>
              <th className='px-6 py-4  text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Status
              </th>
              <th className='px-6 py-4 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Assigned To
              </th>
              <th className='px-6 py-4 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Created At
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Priority
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className='hover:bg-gray-50 transition-colors'
              >
                {/* Ticket ID */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    #{ticket.id}
                  </div>
                </td>

                {/* User Name */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-400' />
                    <span className='text-sm font-medium text-gray-900'>
                      {ticket.user_name}
                    </span>
                  </div>
                </td>

                {/* Service Type */}
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-900'>
                    {ticket.service_type}
                  </div>
                </td>

                {/* Status Badge */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(ticket.status)}
                </td>

                {/* Assigned To */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className={`text-sm font-medium ${ticket.assigned_to === 'unassigned' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {getAssignedLabel(ticket.assigned_to)}
                  </span>
                </td>

                {/* Created At */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(ticket.created_at)}
                  </div>
                </td>

                {/* Priority Badge */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getPriorityBadge(ticket.priority)}
                </td>

                {/* Actions */}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2'>
                    {/* View */}
                    <button
                      onClick={() => onView(ticket)}
                      className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title={translations.table.view}
                    >
                      <Eye className='h-4 w-4' />
                    </button>

                    {/* Assign */}
                    <button
                      onClick={() => onAssign(ticket)}
                      className='p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                      title={translations.table.assign}
                    >
                      <UserPlus className='h-4 w-4' />
                    </button>

                    {/* Close */}
                    <button
                      onClick={() => onClose(ticket)}
                      className='p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title={translations.table.close}
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
      <div className='lg:hidden space-y-4 p-4'>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'
          >
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='text-sm font-semibold text-gray-900'>
                  #{ticket.id}
                </div>
                <div className='text-sm font-medium text-gray-700 mt-1'>
                  {ticket.service_type}
                </div>
              </div>
              <div className='flex flex-col items-end gap-1.5'>
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>

            {/* User Info */}
            <div className='space-y-1.5 pt-2 border-t border-gray-100'>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-gray-400 shrink-0' />
                <span className='font-medium text-gray-900'>
                  {ticket.user_name}
                </span>
              </div>
            </div>

            {/* Assignment & Date */}
            <div className='flex items-center justify-between pt-2 border-t border-gray-100 text-sm'>
              <div>
                <span className='text-gray-500'>Assigned: </span>
                <span className={`font-medium ${ticket.assigned_to === 'unassigned' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {getAssignedLabel(ticket.assigned_to)}
                </span>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                <Calendar className='h-3.5 w-3.5' />
                {formatDate(ticket.created_at)}
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
              <button 
                onClick={() => onView(ticket)} 
                className='flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5'
              >
                <Eye className='h-4 w-4' />
                {translations.table.view}
              </button>

              <button 
                onClick={() => onAssign(ticket)} 
                className='px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors' 
                title={translations.table.assign}
              >
                <UserPlus className='h-4 w-4' />
              </button>

              <button 
                onClick={() => onClose(ticket)} 
                className='px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors' 
                title={translations.table.close}
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ConciergeTicketsTable.displayName = 'ConciergeTicketsTable';

export default ConciergeTicketsTable;
