'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Bell, Check, CheckCheck, Trash2, Filter, Ticket, CheckCircle, DollarSign, FileText, MessageSquare, CreditCard, Settings } from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/components/Toast';

export default function ConciergeNotificationsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, unread, read
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [serverPagination, setServerPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('system');
  const [newActionUrl, setNewActionUrl] = useState('');

  // Filter notifications (server can already filter by unread, but keep client-side fallback)
  const filteredNotifications = useMemo(() => {
    if (filterType === 'unread') return notifications.filter((n) => n.unread === true);
    if (filterType === 'read') return notifications.filter((n) => !n.unread);
    return notifications;
  }, [notifications, filterType]);

  const totalPages = serverPagination.totalPages ?? Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  // Handlers (optimistic UI updates + backend calls)
  const handleMarkAsRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    setGlobalUnreadCount((c) => Math.max(0, c - 1));
    try {
      // Prefer single-item endpoint if available: PUT /notifications/:id/read
      await axiosInstance.put(`/notifications/${id}/read`);
    } catch (err) {
      // Fallback to batch endpoint if single endpoint doesn't exist
      try {
        await axiosInstance.put('/notifications/mark-read', { ids: [id] });
      } catch (err2) {
        console.error('Mark as read failed', err2 || err);
        showToast({ type: 'error', message: 'Failed to mark notification as read' });
      }
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setGlobalUnreadCount(0);
    try {
      await axiosInstance.put('/notifications/mark-all-read');
      showToast({ type: 'success', message: 'All notifications marked as read' });
    } catch (err) {
      console.error('Mark all as read failed', err);
      showToast({ type: 'error', message: 'Failed to mark all as read' });
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    setNotifications((prev) => {
      const n = prev.find((x) => x.id === id);
      if (n && n.unread) setGlobalUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((x) => x.id !== id);
    });
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      showToast({ type: 'success', message: 'Notification deleted' });
    } catch (err) {
      console.error('Delete notification failed', err);
      showToast({ type: 'error', message: 'Failed to delete notification' });
    }
  }, []);

  // Create a new notification (minimal test UI)
  const handleAddNotification = useCallback(async (e) => {
    e?.preventDefault?.();
    const payload = {
      title: newTitle,
      message: newMessage,
      type: newType,
      actionUrl: newActionUrl || undefined,
    };
    try {
      setLoadingNotifications(true);
      const resp = await axiosInstance.post('/notifications', payload);
      showToast({ type: 'success', message: 'Notification created' });
      // Refresh list after creation
      const created = resp?.data || resp;
      if (created && created.id) {
        setNotifications((prev) => [created, ...prev]);
        setServerPagination((p) => ({ ...p, totalItems: (p.totalItems || 0) + 1 }));
        if (created.unread) setGlobalUnreadCount((c) => c + 1);
      } else {
        // fallback: attempt to refetch current page
        try {
          const params = { page: currentPage, limit: itemsPerPage, unreadOnly: filterType === 'unread' };
          const listResp = await axiosInstance.get('/notifications', { params });
          const payload2 = listResp?.data || listResp;
          const data2 = payload2?.data || payload2;
          const notificationsList = data2?.notifications || data2 || [];
          setNotifications(Array.isArray(notificationsList) ? notificationsList : []);
          const p = data2?.pagination || {};
          setServerPagination({ totalPages: p.totalPages || 1, totalItems: p.totalItems || (notificationsList && notificationsList.length) || 0 });
          if (typeof data2?.unreadCount === 'number') setGlobalUnreadCount(data2.unreadCount);
        } catch (errFetch) {
          console.error('Refetch after create failed', errFetch);
        }
      }
      setNewTitle('');
      setNewMessage('');
      setNewType('system');
      setNewActionUrl('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Create notification failed', err);
      showToast({ type: 'error', message: 'Failed to create notification' });
    } finally {
      setLoadingNotifications(false);
    }
  }, [newTitle, newMessage, newType, newActionUrl, currentPage, itemsPerPage, filterType]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationIcon = (type) => {
    const baseClass = 'h-5 w-5 text-gray-500';
    switch (type) {
      case 'ticket_assigned':
        return <Ticket className={baseClass} />;
      case 'quote_approved':
        return <CheckCircle className={baseClass} />;
      case 'quote_request':
        return <DollarSign className={baseClass} />;
      case 'ticket_updated':
        return <FileText className={baseClass} />;
      case 'service_completed':
        return <Check className={baseClass} />;
      case 'client_message':
        return <MessageSquare className={baseClass} />;
      case 'payment_received':
        return <CreditCard className={baseClass} />;
      case 'system':
        return <Settings className={baseClass} />;
      default:
        return <Bell className={baseClass} />;
    }
  };

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          unreadOnly: filterType === 'unread',
        };

        const resp = await axiosInstance.get('/notifications', { params });
        const payload = resp?.data || resp;
        const data = payload?.data || payload;

        // Backend may return { data: { notifications: [...], pagination: {...}, unreadCount } }
        const notificationsList = data?.notifications || data || [];
        setNotifications(Array.isArray(notificationsList) ? notificationsList : []);

        const p = data?.pagination || {};
        setServerPagination({ totalPages: p.totalPages || 1, totalItems: p.totalItems || (notificationsList && notificationsList.length) || 0 });

        if (typeof data?.unreadCount === 'number') setGlobalUnreadCount(data.unreadCount);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
        setNotifications([]);
        setServerPagination({ totalPages: 1, totalItems: 0 });
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [currentPage, itemsPerPage, filterType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-700 mt-2">
            {globalUnreadCount > 0
              ? `You have ${globalUnreadCount} unread notification${globalUnreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {globalUnreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Add Notification form toggle */}
      <div>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
        >
          {showAddForm ? 'Close' : 'New notification'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddNotification} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="px-3 py-2 border rounded-lg w-full"
              required
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full"
            >
              <option value="system">system</option>
              <option value="ticket_assigned">ticket_assigned</option>
              <option value="quote_approved">quote_approved</option>
              <option value="quote_request">quote_request</option>
              <option value="ticket_updated">ticket_updated</option>
              <option value="service_completed">service_completed</option>
              <option value="client_message">client_message</option>
              <option value="payment_received">payment_received</option>
            </select>
            <input
              value={newActionUrl}
              onChange={(e) => setNewActionUrl(e.target.value)}
              placeholder="Action URL (optional)"
              className="px-3 py-2 border rounded-lg w-full"
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message"
              className="px-3 py-2 border rounded-lg w-full"
              rows={2}
              required
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Create</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded-md">Cancel</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'unread'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Unread ({globalUnreadCount})
          </button>
          <button
            onClick={() => setFilterType('read')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'read'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Read ({Math.max(0, notifications.length - globalUnreadCount)})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loadingNotifications ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
        ) : paginatedNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${notification.unread ? 'bg-blue-50/50' : ''
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
          totalItems={serverPagination.totalItems || filteredNotifications.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          translations={{
            pagination: {
              showing: t('common.Showing') || 'Showing',
              of: t('common.of') || 'of',
              previous: t('common.Previous') || 'Previous',
              next: t('common.Next') || 'Next',
            },
          }}
        />
      )}
    </div>
  );
}
