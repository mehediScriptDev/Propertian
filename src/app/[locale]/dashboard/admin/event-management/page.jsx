'use client';

import { use, useState, useMemo, useEffect } from 'react';
import axios from '@/lib/axios';
import { useTranslation } from '@/i18n';
import CreateEventModal from '@/app/[locale]/dashboard/admin/event-management/components/CreateEventModal';
import EventTable from '@/app/[locale]/dashboard/admin/event-management/components/EventTable';
import {
  Calendar,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';

export default function EventManagement({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // Modal state for creating events
  const [isCreateOpen, setIsCreateOpen] = useState(false);



  // Events fetched from API
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axi-u8=ios.get('/events');
      // assume API returns { success, data }
      const data = res?.data?.data ?? res?.data ?? [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search and status
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = (event.title || '').toString().toLowerCase();
      const location = (event.location || '').toString().toLowerCase();
      const matchesSearch =
        title.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || (event.status || '').toString() === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, filterStatus]);

  // Status badge styles - Using consistent color scheme
  const getStatusStyle = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.draft;
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            {t('dashboard.pages.eventManagement.title')}
          </h1>
          <p className=' text-base text-gray-700'>
            {t('dashboard.pages.eventManagement.subtitle')}
          </p>
        </div>
        <button
          type='button'
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center rounded-md bg-accent  px-5 py-2 text-base font-medium text-white cursor-pointer "
        >
          <Plus className='h-5 w-5' />
          {t('dashboard.pages.eventManagement.createEvent')}
        </button>
      </div>

      {/* Filters Section */}
      <div className='rounded-lg bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {/* Search Bar */}
          <div className='relative flex-1 min-w-[300px]'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />

            <input
              type='search'
              className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
              placeholder={t(
                'dashboard.pages.eventManagement.searchPlaceholder'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Status Filter */}
          <div className='relative'>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
            >
              <option value='all'>
                {t('dashboard.pages.eventManagement.filters.all')}
              </option>
              <option value='upcoming'>
                {t('dashboard.pages.eventManagement.filters.upcoming')}
              </option>
              <option value='ongoing'>
                {t('dashboard.pages.eventManagement.filters.ongoing')}
              </option>
              <option value='completed'>
                {t('dashboard.pages.eventManagement.filters.completed')}
              </option>
              <option value='draft'>
                {t('dashboard.pages.eventManagement.filters.draft')}
              </option>
              <option value='cancelled'>
                {t('dashboard.pages.eventManagement.filters.cancelled')}
              </option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          </div>
        </div>
      </div>

      {/* Events Table (moved to EventTable component) */}
      <EventTable events={filteredEvents} loading={loading} error={error} t={t} />

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className='rounded-lg bg-white p-12 shadow-sm'>
          <div className='flex flex-col items-center justify-center text-center'>
            <div className='rounded-full bg-gray-100 p-6'>
              <Calendar className='h-12 w-12 text-gray-400' />
            </div>
            <h3 className='mt-6 text-lg font-semibold text-gray-900'>
              {t('dashboard.pages.eventManagement.noEvents')}
            </h3>
            <p className='mt-2 text-sm text-gray-500'>
              {t('dashboard.pages.eventManagement.noEventsDescription')}
            </p>
            <button
              type='button'
              className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E6B325] px-5 py-2.5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#d4a520]'
            >
              <Plus className='h-5 w-5' />
              {t('dashboard.pages.eventManagement.createFirstEvent')}
            </button>
          </div>
        </div>
      )}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          fetchEvents(); // Refresh events list after modal closes
        }}
        title={t('dashboard.pages.eventManagement.createEvent')}
      />
    </div>
  );
} 
