
"use client";

import { use, useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { Bell, Check, CheckCheck, Trash2, Filter, MessageSquare, CheckCircle, Edit3, Award, Settings } from "lucide-react";
import Pagination from "@/components/dashboard/Pagination";
import { get } from "@/lib/api";

export default function PartnerNotificationsPage({ params }) {
    const { locale } = use(params);
    const { t } = useTranslation(locale);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch notifications data from API
    useEffect(() => {
        let isMounted = true;

        async function fetchNotifications() {
            setLoading(true);
            setError(null);
            try {
                const response = await get(
                    `/notifications?page=${currentPage}&limit=${itemsPerPage}`,
                );

                console.log("API Response:", response);

                if (isMounted && response?.data) {

                    let notificationsData = [];

                    if (Array.isArray(response.data)) {

                        notificationsData = response.data;
                    } else if (
                        response.data.notifications &&
                        Array.isArray(response.data.notifications)
                    ) {

                        notificationsData = response.data.notifications;
                    } else if (response.data.data && Array.isArray(response.data.data)) {

                        notificationsData = response.data.data;
                    }

                    setNotifications(notificationsData);
                    console.log("Notifications set:", notificationsData);
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
                if (isMounted) {
                    setError(err?.message || "Failed to load notifications");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchNotifications();

        return () => {
            isMounted = false;
        };
    }, [currentPage, itemsPerPage]);


    const filteredNotifications = useMemo(() => {

        const notificationsArray = Array.isArray(notifications)
            ? notifications
            : [];

        if (filterType === "unread") {
            return notificationsArray.filter((n) => n.unread);
        } else if (filterType === "read") {
            return notificationsArray.filter((n) => !n.unread);
        }
        return notificationsArray;
    }, [notifications, filterType]);

    // Pagination
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredNotifications.slice(start, start + itemsPerPage);
    }, [filteredNotifications, currentPage, itemsPerPage]);

    // Handlers
    const handleMarkAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        );
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }, []);

    const handleDelete = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const unreadCount = Array.isArray(notifications)
        ? notifications.filter((n) => n.unread).length
        : 0;

    const getNotificationIcon = (type) => {
        switch (type) {
            case "inquiry":
                return <MessageSquare className="h-6 w-6 text-gray-500" />;
            case "listing_approved":
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case "listing_changes_requested":
                return <Edit3 className="h-6 w-6 text-yellow-500" />;
            case "verification_complete":
            case "verification_approved":
                return <Award className="h-6 w-6 text-indigo-500" />;
            case "system":
                return <Settings className="h-6 w-6 text-gray-600" />;
            default:
                return <Bell className="h-6 w-6 text-gray-500" />;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <Bell className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-2">
                        Failed to load notifications
                    </p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-700 mt-2">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
                            }`
                            : "All caught up!"}
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
                        onClick={() => setFilterType("all")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === "all"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All ({Array.isArray(notifications) ? notifications.length : 0})
                    </button>
                    <button
                        onClick={() => setFilterType("unread")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === "unread"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilterType("read")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === "read"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Read (
                        {Array.isArray(notifications)
                            ? notifications.length - unreadCount
                            : 0}
                        )
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
                                className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${notification.unread ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="shrink-0">
                                        {notification.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={notification.image}
                                                alt={notification.title || "notification"}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        )}
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
                        showing: "Showing",
                        to: "to",
                        of: "of",
                        results: "notifications",
                        previous: "Previous",
                        next: "Next",
                    }}
                />
            )}
        </div>
    );
}
