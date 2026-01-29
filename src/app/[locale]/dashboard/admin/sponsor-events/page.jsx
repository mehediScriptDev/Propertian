'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Calendar, Eye, CheckCircle, Play, XCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import SponsorEventRequestsTable from '@/components/dashboard/admin/SponsorEventRequestsTable';
import Pagination from '@/components/dashboard/Pagination';
import ViewEventRequestModal from '@/components/dashboard/admin/ViewEventRequestModal';
import ApproveEventModal from '@/components/dashboard/admin/ApproveEventModal';
import GoLiveModal from '@/components/dashboard/admin/GoLiveModal';
import RejectEventModal from '@/components/dashboard/admin/RejectEventModal';
import axios from '@/lib/axios';

// Event requests will be fetched from the API instead of using mock data

export default function SponsorEventsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  // State for event requests (fetched from API)
  const [eventRequestsData, setEventRequestsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/events/admin/pending-approval', { params: { page: 1, limit: 100 } });
        const raw = res?.data;
        let items = [];
        if (Array.isArray(raw)) items = raw;
        else if (Array.isArray(raw?.data)) items = raw.data;
        else if (Array.isArray(raw?.data?.items)) items = raw.data.items;
        else if (Array.isArray(raw?.items)) items = raw.items;
        else items = [];

        const mapped = items.map((ev) => ({
          id: ev?.id || ev?._id || ev?.eventId,
          event_title: ev?.title || ev?.name || ev?.event_title || 'Untitled',
          sponsor_name: ev?.sponsor?.name || ev?.sponsor_name || (ev.creator && `${ev.creator.firstName || ''} ${ev.creator.lastName || ''}`) || '—',
          event_type: ev?.eventType || ev?.type || ev?.event_type || '—',
          requested_date: ev?.eventDate || ev?.requested_date || ev?.requestedDate || ev?.startDateTime || ev?.start || null,
          submitted_date: ev?.createdAt || ev?.submitted_date || ev?.created_at || null,
          status: (ev?.approvalStatus || ev?.status || ev?.state || 'new'),
          location: ev?.location || ev?.venue || ev?.address || '',
          expected_attendees: ev?.expectedAttendees || ev?.expected_attendees || ev?.expected || '',
          description: ev?.description || ev?.details || '',
          target_audience: ev?.target_audience || ev?.targetAudience || '',
          cover_image: ev?.image || (Array.isArray(ev?.images) && ev.images[0]) || ev?.cover_image || null,
        }));

        if (mounted) setEventRequestsData(mapped);
      } catch (err) {
        console.error('Failed to fetch sponsor event requests', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRequests();
    return () => { mounted = false; };
  }, []);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveEvent, setApproveEvent] = useState(null);
  const [goLiveModalOpen, setGoLiveModalOpen] = useState(false);
  const [goLiveEvent, setGoLiveEvent] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectEvent, setRejectEvent] = useState(null);

  // Filter event requests
  const filteredEventRequests = useMemo(() => {
    let filtered = [...eventRequestsData];

    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((event) => {
        const titleMatch = event.event_title.toLowerCase().includes(query);
        const sponsorMatch = event.sponsor_name.toLowerCase().includes(query);
        const typeMatch = event.event_type.toLowerCase().includes(query);
        const locationMatch = event.location.toLowerCase().includes(query);
        return titleMatch || sponsorMatch || typeMatch || locationMatch;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Event type filter
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter((event) => event.event_type === eventTypeFilter);
    }

    return filtered;
  }, [eventRequestsData, searchTerm, statusFilter, eventTypeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = eventRequestsData.length;
    const new_requests = eventRequestsData.filter((e) => e.status === 'new').length;
    const in_review = eventRequestsData.filter((e) => e.status === 'in_review').length;
    const live = eventRequestsData.filter((e) => e.status === 'live').length;

    return { total, new_requests, in_review, live };
  }, [eventRequestsData]);

  // Pagination
  const totalPages = Math.ceil(filteredEventRequests.length / itemsPerPage);
  const paginatedEventRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEventRequests.slice(startIndex, endIndex);
  }, [filteredEventRequests, currentPage, itemsPerPage]);

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleEventTypeChange = useCallback((e) => {
    setEventTypeFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  // Action handlers
  const handleView = useCallback((event) => {
    setViewEvent(event);
    setViewModalOpen(true);
  }, []);

  const handleApprove = useCallback((event) => {
    setApproveEvent(event);
    setApproveModalOpen(true);
  }, []);

  const handleGoLive = useCallback((event) => {
    setGoLiveEvent(event);
    setGoLiveModalOpen(true);
  }, []);

  const handleReject = useCallback((event) => {
    setRejectEvent(event);
    setRejectModalOpen(true);
  }, []);

  // Modal handlers
  const handleApproveConfirm = useCallback((details) => {
    if (!approveEvent) return;
    // Update event request status to approved in real-time
    setEventRequestsData((prev) =>
      prev.map((e) =>
        e.id === approveEvent.id
          ? {
            ...e,
            status: 'approved',
            approvalStatus: 'APPROVED',
            ...details,
          }
          : e
      )
    );

    setApproveModalOpen(false);
    setApproveEvent(null);
  }, [approveEvent]);

  const handleGoLiveConfirm = useCallback(() => {
    if (!goLiveEvent) return;

    // Update event request status to live
    setEventRequestsData((prev) =>
      prev.map((e) =>
        e.id === goLiveEvent.id ? { ...e, status: 'live' } : e
      )
    );

    setGoLiveModalOpen(false);
    setGoLiveEvent(null);
  }, [goLiveEvent]);

  const handleRejectConfirm = useCallback(() => {
    if (!rejectEvent) return;

    // Update event request status to rejected
    setEventRequestsData((prev) =>
      prev.map((e) =>
        e.id === rejectEvent.id ? { ...e, status: 'rejected' } : e
      )
    );

    setRejectModalOpen(false);
    setRejectEvent(null);
  }, [rejectEvent]);

  // Pagination translations
  const paginationTranslations = useMemo(
    () => ({
      showing: t('common.showing') || 'Showing',
      to: t('common.to') || 'to',
      of: t('common.of') || 'of',
      results: t('common.results') || 'results',
      previous: t('common.previous') || 'Previous',
      next: t('common.next') || 'Next',
    }),
    [t]
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900'>
          Event Requests
        </h1>
        <p className='text-sm sm:text-base text-gray-700 mt-2'>
          Review and manage sponsor event and campaign requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Requests'
          value={stats.total}
          icon={Calendar}
          trend='+12%'
          trendLabel='vs last month'
        />
        <StatsCard
          title='New Requests'
          value={stats.new_requests}
          icon={Eye}
          trend='+5%'
          trendLabel='this week'
        />
        <StatsCard
          title='In Review'
          value={stats.in_review}
          icon={CheckCircle}
          trend='+8%'
          trendLabel='pending approval'
        />
        <StatsCard
          title='Live Events'
          value={stats.live}
          icon={Play}
          trend='+15%'
          trendLabel='currently active'
        />
      </div>

      {/* Filters */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
          {/* Search */}
          <div className='w-full sm:flex-1'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Search by event title, sponsor, type, or location...'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent'
            />
          </div>

          {/* Status Filter */}
          <div className='w-full sm:w-56'>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
            >
              <option value='all'>All Status</option>
              <option value='new'>New</option>
              <option value='in_review'>In Review</option>
              <option value='need_changes'>Need Changes</option>
              <option value='approved'>Approved</option>
              <option value='live'>Live</option>
              <option value='ended'>Ended</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div className='w-full sm:w-56'>
            <select
              value={eventTypeFilter}
              onChange={handleEventTypeChange}
              className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
            >
              <option value='all'>All Types</option>
              <option value='Workshop'>Workshop</option>
              <option value='Seminar'>Seminar</option>
              <option value='Webinar'>Webinar</option>
              <option value='Networking'>Networking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <SponsorEventRequestsTable
          eventRequests={paginatedEventRequests}
          onView={handleView}
          onApprove={handleApprove}
          onGoLive={handleGoLive}
          onReject={handleReject}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEventRequests.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          showItemsPerPage={true}
          translations={paginationTranslations}
        />
      </div>

      {/* Modals */}
      <ViewEventRequestModal
        open={viewModalOpen}
        eventRequest={viewEvent}
        onClose={() => setViewModalOpen(false)}
      />
      <ApproveEventModal
        open={approveModalOpen}
        eventRequest={approveEvent}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
      />
      <GoLiveModal
        open={goLiveModalOpen}
        eventRequest={goLiveEvent}
        onClose={() => setGoLiveModalOpen(false)}
        onConfirm={handleGoLiveConfirm}
      />
      <RejectEventModal
        open={rejectModalOpen}
        eventRequest={rejectEvent}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
