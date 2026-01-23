'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';

// Mock notification data for Concierge Partner
const CONCIERGE_NOTIFICATIONS = [
  {
    id: 1,
    type: 'ticket_assigned',
    title: 'New Ticket Assigned',
    message: 'You have been assigned ticket #CON-2045 - Airport pickup service for VIP client',
    time: '10 minutes ago',
    timestamp: '2026-01-12T14:25:00Z',
    unread: true,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 2,
    type: 'quote_approved',
    title: 'Quote Approved',
    message: 'Your quote for relocation service (Ticket #CON-2038) was approved by the client',
    time: '2 hours ago',
    timestamp: '2026-01-12T12:35:00Z',
    unread: true,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 3,
    type: 'ticket_updated',
    title: 'Ticket Updated',
    message: 'Admin updated ticket #CON-2040 - Please review the new requirements',
    time: '4 hours ago',
    timestamp: '2026-01-12T10:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 4,
    type: 'quote_request',
    title: 'Quote Request',
    message: 'Admin requested a quote for ticket #CON-2035 - Property setup service',
    time: '6 hours ago',
    timestamp: '2026-01-12T08:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 5,
    type: 'service_completed',
    title: 'Service Marked Complete',
    message: 'Client confirmed completion of ticket #CON-2030 - Moving assistance service',
    time: '1 day ago',
    timestamp: '2026-01-11T14:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 6,
    type: 'client_message',
    title: 'New Client Message',
    message: 'Client sent a message regarding ticket #CON-2042',
    time: '1 day ago',
    timestamp: '2026-01-11T10:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 7,
    type: 'payment_received',
    title: 'Payment Received',
    message: 'Payment received for ticket #CON-2025 - Translation services',
    time: '2 days ago',
    timestamp: '2026-01-10T14:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/tickets',
  },
  {
    id: 8,
    type: 'system',
    title: 'Profile Verification Required',
    message: 'Please update your service credentials for continued concierge operations',
    time: '3 days ago',
    timestamp: '2026-01-09T14:35:00Z',
    unread: false,
    actionUrl: '/dashboard/concierge/profile',
  },
];

export default function ConciergeNotificationsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const [notifications, setNotifications] = useState(CONCIERGE_NOTIFICATIONS);
  const [filterType, setFilterType] = useState('all'); // all, unread, read
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filterType === 'unread') {
      return notifications.filter((n) => n.unread);
    } else if (filterType === 'read') {
      return notifications.filter((n) => !n.unread);
    }
    return notifications;
  }, [notifications, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  // Handlers
  const handleMarkAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleDelete = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_assigned':
        return '🎫';
      case 'quote_approved':
        return '✅';
      case 'quote_request':
        return '💰';
      case 'ticket_updated':
        return '📝';
      case 'service_completed':
        return '🎉';
      case 'client_message':
        return '💬';
      case 'payment_received':
        return '💳';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-700 mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${
                  unreadCount > 1 ? 's' : ''
                }`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === 'unread'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType('read')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filterType === 'read'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {paginatedNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                  notification.unread ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                          {notification.unread && (
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.unread && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredNotifications.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          translations={{
            showing: 'Showing',
            to: 'to',
            of: 'of',
            results: 'notifications',
            previous: 'Previous',
            next: 'Next',
          }}
        />
      )}
    </div>
  );
}
