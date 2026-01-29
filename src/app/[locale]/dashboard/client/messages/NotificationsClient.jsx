"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import React, { useState } from 'react';

export default function NotificationsClient() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'New Listing Match',
            title: 'New 3-BR villa in Assinie',
            description: 'This property matches your saved search criteria. Featuring a private pool and ocean views.',
            time: '2 hours ago',
            read: false,
            image: '',
            action: 'View Property'
        },
        {
            id: 2,
            type: 'Price Drop Alert',
            title: '4-bedroom villa in Cocody',
            description: "The price on this property you saved has just dropped by 5%. Don't miss out on this opportunity.",
            time: 'Yesterday',
            read: false,
            image: '',
            action: 'View Details'
        }
    ]);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 md:mb-10">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                            {t ? t('dashboard.client.yourNotifications') : 'Your Notifications'} ({unreadCount})
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            {t ? t('dashboard.client.notificationSubtitle') : 'Recent alerts and updates'}
                        </p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="bg-gray-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm md:text-base whitespace-nowrap"
                    >
                        {t ? t('dashboard.client.markallRead') : 'Mark all as read'}
                    </button>
                </div>

                <div className="space-y-6 lg:space-y-8">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start border-y py-4 border-gray-300 pb-6 lg:pb-8">
                            <div className="flex flex-row lg:flex-col items-center gap-3 lg:gap-0 lg:pt-1 flex-shrink-0">
                                <div className={`w-3 h-3 rounded-full ${notif.read ? 'bg-gray-400' : 'bg-amber-500'}`}></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`text-xs lg:text-sm font-semibold mb-2 text-amber-600`}>{notif.type}</div>
                                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">{notif.title}</h3>
                                <p className="text-sm lg:text-base text-gray-600 mb-3 break-words">{notif.description}</p>
                                <div className="text-xs lg:text-sm text-gray-500 mb-4">{notif.time}</div>
                                <button className="text-blue-600 font-semibold hover:text-blue-700 transition text-sm lg:text-base">{notif.action}</button>
                            </div>

                            <div className="w-full lg:w-64 flex-shrink-0 lg:flex-shrink">
                                {notif.image ? (
                                    <img src={notif.image} alt={notif.title} className="w-full lg:w-64 h-40 lg:h-40 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-full lg:w-64 h-40 lg:h-40 bg-gray-100 rounded-lg" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
