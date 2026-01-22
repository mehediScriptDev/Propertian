// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import axios from '@/lib/axios';
// import { useTranslation } from '@/i18n';
// import { useParams } from 'next/navigation';
// import CreateEventModal from '@/app/[locale]/dashboard/admin/event-management/components/CreateEventModal';
// import EventTable from '@/app/[locale]/dashboard/admin/event-management/components/EventTable';
// import {
//   Calendar,
//   Plus,
//   Search,
//   ChevronDown,
// } from 'lucide-react';

// export default function EventManagement() {
//   // ✅ All hooks at the top - NO conditional returns before hooks
//   const params = useParams();
//   const locale = params?.locale || 'en';
//   const { t } = useTranslation(locale);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ All state initialization done before any logic
//   const fetchEvents = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get('/events');
//       const data = res?.data?.data ?? res?.data ?? [];
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || 'Failed to load events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const filteredEvents = useMemo(() => {
//     return events.filter((event) => {
//       const title = (event.title || '').toString().toLowerCase();
//       const location = (event.location || '').toString().toLowerCase();
//       const matchesSearch =
//         title.includes(searchQuery.toLowerCase()) ||
//         location.includes(searchQuery.toLowerCase());
//       const matchesStatus = filterStatus === 'all' || (event.status || '').toString() === filterStatus;
//       return matchesSearch && matchesStatus;
//     });
//   }, [events, searchQuery, filterStatus]);

//   // ✅ Now render logic after all hooks
//   return (
//     <div className='space-y-6'>
//       {/* Page Header */}
//       <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
//         <div>
//           <h1 className='text-4xl font-bold text-gray-900 mb-2'>
//             {t('dashboard.pages.eventManagement.title')}
//           </h1>
//           <p className='text-base text-gray-700'>
//             {t('dashboard.pages.eventManagement.subtitle')}
//           </p>
//         </div>
//         <button
//           type='button'
//           onClick={() => setIsCreateOpen(true)}
//           className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white cursor-pointer"
//         >
//           <Plus className='h-5 w-5' />
//           {t('dashboard.pages.eventManagement.createEvent')}
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div className='rounded-lg bg-white p-6 shadow-sm'>
//         <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
//           {/* Search Bar */}
//           <div className='relative flex-1 min-w-[300px]'>
//             <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />

//             <input
//               type='search'
//               className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
//               placeholder={t(
//                 'dashboard.pages.eventManagement.searchPlaceholder'
//               )}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           <div className='relative'>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
//             >
//               <option value='all'>
//                 {t('dashboard.pages.eventManagement.filters.all')}
//               </option>
//               <option value='upcoming'>
//                 {t('dashboard.pages.eventManagement.filters.upcoming')}
//               </option>
//               <option value='ongoing'>
//                 {t('dashboard.pages.eventManagement.filters.ongoing')}
//               </option>
//               <option value='completed'>
//                 {t('dashboard.pages.eventManagement.filters.completed')}
//               </option>
//               <option value='draft'>
//                 {t('dashboard.pages.eventManagement.filters.draft')}
//               </option>
//               <option value='cancelled'>
//                 {t('dashboard.pages.eventManagement.filters.cancelled')}
//               </option>
//             </select>
//             <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
//           </div>
//         </div>
//       </div>

//       {/* Events Table */}
//       <EventTable 
//         events={filteredEvents} 
//         loading={loading} 
//         error={error} 
//         t={t} 
//       />

//       {/* Empty State */}
//       {!loading && filteredEvents.length === 0 && (
//         <div className='rounded-lg bg-white p-12 shadow-sm'>
//           <div className='flex flex-col items-center justify-center text-center'>
//             <div className='rounded-full bg-gray-100 p-6'>
//               <Calendar className='h-12 w-12 text-gray-400' />
//             </div>
//             <h3 className='mt-6 text-lg font-semibold text-gray-900'>
//               {t('dashboard.pages.eventManagement.noEvents')}
//             </h3>
//             <p className='mt-2 text-sm text-gray-500'>
//               {t('dashboard.pages.eventManagement.noEventsDescription')}
//             </p>
//             <button
//               type='button'
//               onClick={() => setIsCreateOpen(true)}
//               className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E6B325] px-5 py-2.5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#d4a520]'
//             >
//               <Plus className='h-5 w-5' />
//               {t('dashboard.pages.eventManagement.createFirstEvent')}
//             </button>
//           </div>
//         </div>
//       )}
      
//       <CreateEventModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         onSuccess={fetchEvents}
//         title={t('dashboard.pages.eventManagement.createEvent')}
//       />
//     </div>
//   );
// }









// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import axios from '@/lib/axios';
// import { useTranslation } from '@/i18n';
// import { useParams } from 'next/navigation';
// import CreateEventModal from '@/app/[locale]/dashboard/admin/event-management/components/CreateEventModal';
// import EventTable from '@/app/[locale]/dashboard/admin/event-management/components/EventTable';
// import {
//   Calendar,
//   Plus,
//   Search,
//   ChevronDown,
// } from 'lucide-react';

// export default function EventManagement() {
//   // ✅ All hooks at the top - NO conditional returns before hooks
//   const params = useParams();
//   const locale = params?.locale || 'en';
//   const { t } = useTranslation(locale);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ All state initialization done before any logic
//   const fetchEvents = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get('/events');
//       const data = res?.data?.data ?? res?.data ?? [];
//       console.log('Fetched events:', data); // Debug log
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || 'Failed to load events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const filteredEvents = useMemo(() => {
//     return events.filter((event) => {
//       const title = (event.title || '').toString().toLowerCase();
//       const location = (event.location || '').toString().toLowerCase();
//       const matchesSearch =
//         title.includes(searchQuery.toLowerCase()) ||
//         location.includes(searchQuery.toLowerCase());
//       const matchesStatus = filterStatus === 'all' || (event.status || '').toString() === filterStatus;
//       return matchesSearch && matchesStatus;
//     });
//   }, [events, searchQuery, filterStatus]);

//   // ✅ Now render logic after all hooks
//   return (
//     <div className='space-y-6'>
//       {/* Page Header */}
//       <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
//         <div>
//           <h1 className='text-4xl font-bold text-gray-900 mb-2'>
//             {t('dashboard.pages.eventManagement.title')}
//           </h1>
//           <p className='text-base text-gray-700'>
//             {t('dashboard.pages.eventManagement.subtitle')}
//           </p>
//         </div>
//         <button
//           type='button'
//           onClick={() => setIsCreateOpen(true)}
//           className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white cursor-pointer"
//         >
//           <Plus className='h-5 w-5' />
//           {t('dashboard.pages.eventManagement.createEvent')}
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div className='rounded-lg bg-white p-6 shadow-sm'>
//         <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
//           {/* Search Bar */}
//           <div className='relative flex-1 min-w-[300px]'>
//             <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />

//             <input
//               type='search'
//               className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
//               placeholder={t(
//                 'dashboard.pages.eventManagement.searchPlaceholder'
//               )}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           <div className='relative'>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
//             >
//               <option value='all'>
//                 {t('dashboard.pages.eventManagement.filters.all')}
//               </option>
//               <option value='upcoming'>
//                 {t('dashboard.pages.eventManagement.filters.upcoming')}
//               </option>
//               <option value='ongoing'>
//                 {t('dashboard.pages.eventManagement.filters.ongoing')}
//               </option>
//               <option value='completed'>
//                 {t('dashboard.pages.eventManagement.filters.completed')}
//               </option>
//               <option value='draft'>
//                 {t('dashboard.pages.eventManagement.filters.draft')}
//               </option>
//               <option value='cancelled'>
//                 {t('dashboard.pages.eventManagement.filters.cancelled')}
//               </option>
//             </select>
//             <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
//           </div>
//         </div>
//       </div>

//       {/* Events Table */}
//       <EventTable 
//         events={filteredEvents} 
//         loading={loading} 
//         error={error} 
//         t={t} 
//       />

//       {/* Empty State */}
//       {!loading && filteredEvents.length === 0 && (
//         <div className='rounded-lg bg-white p-12 shadow-sm'>
//           <div className='flex flex-col items-center justify-center text-center'>
//             <div className='rounded-full bg-gray-100 p-6'>
//               <Calendar className='h-12 w-12 text-gray-400' />
//             </div>
//             <h3 className='mt-6 text-lg font-semibold text-gray-900'>
//               {t('dashboard.pages.eventManagement.noEvents')}
//             </h3>
//             <p className='mt-2 text-sm text-gray-500'>
//               {t('dashboard.pages.eventManagement.noEventsDescription')}
//             </p>
//             <button
//               type='button'
//               onClick={() => setIsCreateOpen(true)}
//               className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E6B325] px-5 py-2.5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#d4a520]'
//             >
//               <Plus className='h-5 w-5' />
//               {t('dashboard.pages.eventManagement.createFirstEvent')}
//             </button>
//           </div>
//         </div>
//       )}
      
//       <CreateEventModal
//         isOpen={isCreateOpen}
//         onClose={() => {
//           setIsCreateOpen(false);
//           // Refresh after modal closes to ensure latest data
//           setTimeout(() => {
//             fetchEvents();
//           }, 100);
//         }}
//         onSuccess={fetchEvents}
//         title={t('dashboard.pages.eventManagement.createEvent')}
//       />
//     </div>
//   );
// }



'use client';

import { useState, useMemo, useEffect } from 'react';
import axios from '@/lib/axios';
import { useTranslation } from '@/i18n';
import { useParams } from 'next/navigation';
import CreateEventModal from '@/app/[locale]/dashboard/admin/event-management/components/CreateEventModal';
import EventTable from '@/app/[locale]/dashboard/admin/event-management/components/EventTable';
import { Calendar, Plus, Search, ChevronDown } from 'lucide-react';

export default function EventManagement() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const { t } = useTranslation(locale);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Data State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Logic
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/events');
      // Ensure we always extract an array
      const data = res?.data?.data ?? res?.data ?? [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err?.response?.data?.message || err.message || 'Failed to load events');
      setEvents([]); // Ensure it's empty array on error, not null
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = (event.title || '').toString().toLowerCase();
      const location = (event.location?.address || event.location || '').toString().toLowerCase(); // Check location object or string
      const matchesSearch =
        title.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || (event.status || '').toString() === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, filterStatus]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            {t('dashboard.pages.eventManagement.title')}
          </h1>
          <p className='text-base text-gray-700'>
            {t('dashboard.pages.eventManagement.subtitle')}
          </p>
        </div>
        <button
          type='button'
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white cursor-pointer hover:bg-accent/90 transition-colors"
        >
          <Plus className='h-5 w-5 mr-2' />
          {t('dashboard.pages.eventManagement.createEvent')}
        </button>
      </div>

      {/* Filters */}
      <div className='rounded-lg bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative flex-1 min-w-[300px]'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input
              type='search'
              className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
              placeholder={t('dashboard.pages.eventManagement.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='relative'>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
            >
              <option value='all'>{t('dashboard.pages.eventManagement.filters.all')}</option>
              <option value='UPCOMING'>{t('dashboard.pages.eventManagement.filters.upcoming')}</option>
              <option value='ONGOING'>{t('dashboard.pages.eventManagement.filters.ongoing')}</option>
              <option value='COMPLETED'>{t('dashboard.pages.eventManagement.filters.completed')}</option>
              <option value='CANCELLED'>{t('dashboard.pages.eventManagement.filters.cancelled')}</option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          </div>
        </div>
      </div>

      {/* Table */}
      <EventTable 
        events={filteredEvents} 
        loading={loading} 
        error={error} 
        t={t} 
      />

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
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
              onClick={() => setIsCreateOpen(true)}
              className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E6B325] px-5 py-2.5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#d4a520]'
            >
              <Plus className='h-5 w-5' />
              {t('dashboard.pages.eventManagement.createFirstEvent')}
            </button>
          </div>
        </div>
      )}
      
      {/* Modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)} // Simply close state, don't re-fetch
        onSuccess={fetchEvents} // Pass fetch function here to be called AFTER creation
        title={t('dashboard.pages.eventManagement.createEvent')}
      />
    </div>
  );
}