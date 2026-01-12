'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

/**
 * Notification Button Component
 * Shows notification bell with badge and dropdown preview
 * Only visible for admin, listing partner, and concierge partner roles
 */
export default function NotificationButton() {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine role and notification path
  const isAdmin = user?.role === 'admin';
  const isPartner = pathname?.includes('/dashboard/partner');
  const isConcierge = pathname?.includes('/dashboard/concierge');
  const isSponsor = pathname?.includes('/dashboard/sponsor');

  // Only show for admin, listing partner, or concierge partner
  const shouldShow = isAdmin || isPartner || isConcierge;

  // Determine notification page path based on current location
  let notificationPath = '';
  if (isAdmin) {
    notificationPath = `/${locale}/dashboard/admin/notifications`;
  } else if (isConcierge) {
    notificationPath = `/${locale}/dashboard/concierge/notifications`;
  } else if (isPartner || isSponsor) {
    notificationPath = `/${locale}/dashboard/partner/notifications`;
  }

  // Mock notification data - would come from API in production
  const notifications = isAdmin
    ? [
        {
          id: 1,
          type: 'partner_application',
          title: 'New Partner Application',
          message: 'Elite Properties Ltd submitted an application',
          time: '5 minutes ago',
          unread: true,
        },
        {
          id: 2,
          type: 'concierge_ticket',
          title: 'New Concierge Request',
          message: 'Airport pickup service requested by John Doe',
          time: '15 minutes ago',
          unread: true,
        },
        {
          id: 3,
          type: 'verification',
          title: 'Verification Request',
          message: 'Property #12345 needs verification review',
          time: '1 hour ago',
          unread: false,
        },
      ]
    : isConcierge
    ? [
        {
          id: 1,
          type: 'ticket_assigned',
          title: 'New Ticket Assigned',
          message: 'You have been assigned ticket #CON-2045',
          time: '10 minutes ago',
          unread: true,
        },
        {
          id: 2,
          type: 'quote_approved',
          title: 'Quote Approved',
          message: 'Your quote for relocation service was approved',
          time: '2 hours ago',
          unread: true,
        },
      ]
    : [
        {
          id: 1,
          type: 'inquiry',
          title: 'New Inquiry',
          message: 'Someone inquired about your property listing',
          time: '5 minutes ago',
          unread: true,
        },
        {
          id: 2,
          type: 'listing_approved',
          title: 'Listing Approved',
          message: 'Your property listing has been approved',
          time: '1 hour ago',
          unread: true,
        },
        {
          id: 3,
          type: 'verification_complete',
          title: 'Verification Complete',
          message: 'Your property verification is complete',
          time: '3 hours ago',
          unread: false,
        },
      ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!shouldShow) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="sm:h-6 sm:w-6 w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-gray-200 bg-white shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.unread && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0"/>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3">
            <Link
              href={notificationPath}
              className="block text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
