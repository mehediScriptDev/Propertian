



// 'use client';

// import { use, useState, useMemo, useCallback, useEffect } from 'react';
// import { useTranslation } from '@/i18n';
// import { Bell, Check, CheckCheck, Trash2, Filter, Users, Tag, Home, Calendar, MessageSquare, Briefcase } from 'lucide-react';
// import Pagination from '@/components/dashboard/Pagination';
// import axiosInstance from '@/lib/axios';
// import { showToast } from '@/components/Toast';

// export default function UserNotificationsPage({ params }) {
//     const { locale } = use(params);
//     const { t } = useTranslation(locale);

//     const [notifications, setNotifications] = useState([]);
//     const [filterType, setFilterType] = useState('all');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
//     const [loadingNotifications, setLoadingNotifications] = useState(false);
//     const [serverPagination, setServerPagination] = useState({ totalPages: 1, totalItems: 0 });
//     const [globalUnreadCount, setGlobalUnreadCount] = useState(0);

//     // Filter logic
//     const filteredNotifications = useMemo(() => {
//         if (filterType === 'unread') {
//             return notifications; // API already filters this, but good for client-side fallback
//         } else if (filterType === 'read') {
//             return notifications.filter((n) => !n.unread);
//         }
//         return notifications;
//     }, [notifications, filterType]);

//     const totalPages = serverPagination.totalPages ?? Math.ceil(filteredNotifications.length / itemsPerPage);

//     // Handler: Mark Single Notification as Read
//     const handleMarkAsRead = useCallback(async (id) => {
//         // Optimistic UI Update
//         setNotifications((prev) =>
//             prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
//         );
//         setGlobalUnreadCount(prev => Math.max(0, prev - 1));

//         try {
//             // API Call
//             await axiosInstance.put('/notifications/mark-read', { ids: [id] });
//         } catch (error) {
//             console.error("Failed to mark as read", error);
//             showToast({ type: 'error', message: 'Failed to mark as read' });
//         }
//     }, []);

//     // Handler: Mark All as Read (Based on Image API)
//     const handleMarkAllAsRead = useCallback(async () => {
//         // Optimistic UI Update
//         setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
//         setGlobalUnreadCount(0);

//         try {
//             // API Call: PUT /notifications/mark-all-read
//             await axiosInstance.put('/notifications/mark-all-read');
//             showToast({ type: 'success', message: 'All notifications marked as read' });
//         } catch (error) {
//             console.error("Failed to mark all as read", error);
//             // Revert optimistic update (optional, complex to track previous state)
//             showToast({ type: 'error', message: 'Failed to update notifications' });
//         }
//     }, []);

//     // Handler: Delete Notification
//     const handleDelete = useCallback(async (id) => {
//         // Optimistic UI Update & Unread Count Adjustment
//         setNotifications((prev) => {
//             const notification = prev.find(n => n.id === id);
//             if (notification && notification.unread) {
//                 setGlobalUnreadCount(c => Math.max(0, c - 1));
//             }
//             return prev.filter((n) => n.id !== id);
//         });

//         try {
//             // API Call: DELETE /notifications/:id
//             await axiosInstance.delete(`/notifications/${id}`);
//             showToast({ type: 'success', message: 'Notification deleted' });
//         } catch (error) {
//             console.error("Failed to delete notification", error);
//             showToast({ type: 'error', message: 'Failed to delete notification' });
//         }
//     }, []);

//     const handleFilterChange = (type) => {
//         setFilterType(type);
//         setCurrentPage(1);
//     };

//     const getNotificationIcon = (type) => {
//         const baseClass = 'h-5 w-5 text-gray-500';
//         switch (type) {
//             case 'partner_application': return <Users className={baseClass} />;
//             case 'concierge_ticket': return <Tag className={baseClass} />;
//             case 'verification': return <Check className={baseClass} />;
//             case 'listing_submission': return <Home className={baseClass} />;
//             case 'sponsor_event': return <Calendar className={baseClass} />;
//             case 'inquiry': return <MessageSquare className={baseClass} />;
//             case 'concierge_partner': return <Briefcase className={baseClass} />;
//             default: return <Bell className={baseClass} />;
//         }
//     };

//     // Fetch notifications
//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 setLoadingNotifications(true);

//                 const queryParams = {
//                     page: currentPage,
//                     limit: itemsPerPage,
//                     unreadOnly: filterType === 'unread'
//                 };

//                 const resp = await axiosInstance.get('/notifications', { params: queryParams });

//                 if (resp?.data?.success) {
//                     const data = resp.data.data || {};
//                     setNotifications(data.notifications || []);
                    
//                     const p = data.pagination || {};
//                     setServerPagination({
//                         totalPages: p.totalPages || 1,
//                         totalItems: p.totalItems || 0
//                     });

//                     if (typeof data.unreadCount === 'number') {
//                         setGlobalUnreadCount(data.unreadCount);
//                     }
//                 } else {
//                     setNotifications([]);
//                     setServerPagination({ totalPages: 1, totalItems: 0 });
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch notifications', err);
//                 setNotifications([]);
//                 setServerPagination({ totalPages: 1, totalItems: 0 });
//             } finally {
//                 setLoadingNotifications(false);
//             }
//         };

//         fetchNotifications();
//     }, [currentPage, itemsPerPage, filterType]);

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
//                     <p className="text-sm text-gray-700 mt-2">
//                         {globalUnreadCount > 0
//                             ? `You have ${globalUnreadCount} unread notification${globalUnreadCount > 1 ? 's' : ''}`
//                             : 'All caught up!'}
//                     </p>
//                 </div>
                
//                 {/* Mark All as Read Button */}
//                 {globalUnreadCount > 0 && (
//                     <button
//                         onClick={handleMarkAllAsRead}
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg hover:bg-primary/5"
//                     >
//                         <CheckCheck className="h-4 w-4" />
//                         Mark all as read
//                     </button>
//                 )}
//             </div>

//             {/* Filters */}
//             <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
//                 <Filter className="h-5 w-5 text-gray-400" />
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handleFilterChange('all')}
//                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'all'
//                             ? 'bg-primary text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                     >
//                         All
//                     </button>
//                     <button
//                         onClick={() => handleFilterChange('unread')}
//                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'unread'
//                             ? 'bg-primary text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                     >
//                         Unread ({globalUnreadCount})
//                     </button>
//                     <button
//                         onClick={() => handleFilterChange('read')}
//                         className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'read'
//                             ? 'bg-primary text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                     >
//                         Read
//                     </button>
//                 </div>
//             </div>

//             {/* Notifications List */}
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                 {loadingNotifications ? (
//                     <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
//                 ) : filteredNotifications.length === 0 ? (
//                     <div className="px-6 py-12 text-center">
//                         <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                         <p className="text-gray-500">No notifications found</p>
//                     </div>
//                 ) : (
//                     <div className="divide-y divide-gray-200">
//                         {filteredNotifications.map((notification) => (
//                             <div
//                                 key={notification.id}
//                                 className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${notification.unread ? 'bg-blue-50/50' : ''
//                                     }`}
//                             >
//                                 <div className="flex items-start gap-4">
//                                     {/* Icon */}
//                                     <div className="shrink-0 text-2xl">
//                                         {getNotificationIcon(notification.type)}
//                                     </div>

//                                     {/* Content */}
//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex items-start justify-between gap-4">
//                                             <div className="flex-1">
//                                                 <h3 className="text-sm font-semibold text-gray-900 mb-1">
//                                                     {notification.title}
//                                                     {notification.unread && (
//                                                         <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
//                                                     )}
//                                                 </h3>
//                                                 <p className="text-sm text-gray-600 mb-2">
//                                                     {notification.message}
//                                                 </p>
//                                                 <p className="text-xs text-gray-400">
//                                                     {notification.time}
//                                                 </p>
//                                             </div>

//                                             {/* Actions */}
//                                             <div className="flex items-center gap-2">
//                                                 {/* Mark Single as Read Button */}
//                                                 {notification.unread && (
//                                                     <button
//                                                         onClick={() => handleMarkAsRead(notification.id)}
//                                                         className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
//                                                         title="Mark as read"
//                                                     >
//                                                         <Check className="h-4 w-4" />
//                                                     </button>
//                                                 )}
                                                
//                                                 {/* Delete Button */}
//                                                 <button
//                                                     onClick={() => handleDelete(notification.id)}
//                                                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Action Button Link */}
//                                         {/* {notification.actionUrl && (
//                                             <a
//                                                 href={notification.actionUrl}
//                                                 className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
//                                             >
//                                                 View Details →
//                                             </a>
//                                         )} */}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     totalItems={serverPagination.totalItems || filteredNotifications.length}
//                     itemsPerPage={itemsPerPage}
//                     onPageChange={setCurrentPage}
//                     translations={{
//                         showing: 'Showing',
//                         to: 'to',
//                         of: 'of',
//                         results: 'notifications',
//                         previous: 'Previous',
//                         next: 'Next',
//                     }}
//                 />
//             )}
//         </div>
//     );
// }



'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Bell, Check, CheckCheck, Trash2, Filter, Users, Tag, Home, Calendar, MessageSquare, Briefcase } from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/components/Toast';

export default function UserNotificationsPage({ params }) {
    const { locale } = use(params);
    const { t } = useTranslation(locale);

    const [notifications, setNotifications] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [serverPagination, setServerPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [globalUnreadCount, setGlobalUnreadCount] = useState(0);

    // Filter logic (Updated to match AdminPage strict filtering)
    const filteredNotifications = useMemo(() => {
        // If filter is 'unread', strictly return only unread items
        if (filterType === 'unread') {
            return notifications.filter((n) => n.unread === true);
        } 
        // If filter is 'read', return read items
        else if (filterType === 'read') {
            return notifications.filter((n) => !n.unread);
        }
        // Default returns all
        return notifications;
    }, [notifications, filterType]);

    const totalPages = serverPagination.totalPages ?? Math.ceil(filteredNotifications.length / itemsPerPage);

    // Handler: Mark Single Notification as Read
    const handleMarkAsRead = useCallback(async (id) => {
        // Optimistic UI Update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
        );
        setGlobalUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await axiosInstance.put('/notifications/mark-read', { ids: [id] });
        } catch (error) {
            console.error("Failed to mark as read", error);
            showToast({ type: 'error', message: 'Failed to mark as read' });
        }
    }, []);

    // Handler: Mark All as Read
    const handleMarkAllAsRead = useCallback(async () => {
        // Optimistic UI Update
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        setGlobalUnreadCount(0);

        try {
            await axiosInstance.put('/notifications/mark-all-read');
            showToast({ type: 'success', message: 'All notifications marked as read' });
        } catch (error) {
            console.error("Failed to mark all as read", error);
            showToast({ type: 'error', message: 'Failed to update notifications' });
        }
    }, []);

    // Handler: Delete Notification
    const handleDelete = useCallback(async (id) => {
        // Optimistic UI Update & Unread Count Adjustment
        setNotifications((prev) => {
            const notification = prev.find(n => n.id === id);
            if (notification && notification.unread) {
                setGlobalUnreadCount(c => Math.max(0, c - 1));
            }
            return prev.filter((n) => n.id !== id);
        });

        try {
            await axiosInstance.delete(`/notifications/${id}`);
            showToast({ type: 'success', message: 'Notification deleted' });
        } catch (error) {
            console.error("Failed to delete notification", error);
            showToast({ type: 'error', message: 'Failed to delete notification' });
        }
    }, []);

    const handleFilterChange = (type) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const getNotificationIcon = (type) => {
        const baseClass = 'h-5 w-5 text-gray-500';
        switch (type) {
            case 'partner_application': return <Users className={baseClass} />;
            case 'concierge_ticket': return <Tag className={baseClass} />;
            case 'verification': return <Check className={baseClass} />;
            case 'listing_submission': return <Home className={baseClass} />;
            case 'sponsor_event': return <Calendar className={baseClass} />;
            case 'inquiry': return <MessageSquare className={baseClass} />;
            case 'concierge_partner': return <Briefcase className={baseClass} />;
            default: return <Bell className={baseClass} />;
        }
    };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoadingNotifications(true);

                const queryParams = {
                    page: currentPage,
                    limit: itemsPerPage,
                    unreadOnly: filterType === 'unread'
                };

                const resp = await axiosInstance.get('/notifications', { params: queryParams });

                if (resp?.data?.success) {
                    const data = resp.data.data || {};
                    setNotifications(data.notifications || []);
                    
                    const p = data.pagination || {};
                    setServerPagination({
                        totalPages: p.totalPages || 1,
                        totalItems: p.totalItems || 0
                    });

                    if (typeof data.unreadCount === 'number') {
                        setGlobalUnreadCount(data.unreadCount);
                    }
                } else {
                    setNotifications([]);
                    setServerPagination({ totalPages: 1, totalItems: 0 });
                }
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
                
                {/* Mark All as Read Button */}
                {globalUnreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg hover:bg-primary/5"
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
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleFilterChange('unread')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'unread'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Unread ({globalUnreadCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange('read')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === 'read'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Read
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {loadingNotifications ? (
                    <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredNotifications.map((notification) => (
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
                                                {/* Mark Single as Read Button */}
                                                {notification.unread && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Button Link */}
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