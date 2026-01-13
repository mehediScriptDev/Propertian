'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Calendar, Eye, CheckCircle, Play, XCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import SponsorEventRequestsTable from '@/components/dashboard/admin/SponsorEventRequestsTable';
import Pagination from '@/components/dashboard/Pagination';
import ViewEventRequestModal from '@/components/dashboard/admin/ViewEventRequestModal';
import ApproveEventModal from '@/components/dashboard/admin/ApproveEventModal';
import GoLiveModal from '@/components/dashboard/admin/GoLiveModal';
import RejectEventModal from '@/components/dashboard/admin/RejectEventModal';

// Mock sponsor event request data
const MOCK_EVENT_REQUESTS = [
  {
    id: 'evt001',
    event_title: 'Luxury Property Investment Seminar',
    sponsor_name: 'Luxury Real Estate Group',
    event_type: 'Seminar',
    requested_date: '2026-02-15T14:00:00Z',
    submitted_date: '2026-01-08T10:30:00Z',
    location: 'Grand Hotel Conference Center, New York',
    status: 'new',
    expected_attendees: '150',
    description: 'An exclusive seminar focused on luxury property investment strategies for high-net-worth individuals. Topics include market trends, portfolio diversification, and tax optimization.',
    target_audience: 'High-net-worth individuals, investors, real estate professionals',
    cover_image: null,
  },
  {
    id: 'evt002',
    event_title: 'Sustainable Housing Webinar',
    sponsor_name: 'Modern Living Developments',
    event_type: 'Webinar',
    requested_date: '2026-02-20T16:00:00Z',
    submitted_date: '2026-01-07T14:20:00Z',
    status: 'approved',
    location: 'Online (Zoom)',
    expected_attendees: '300',
    description: 'Join us for an interactive webinar on sustainable housing solutions and green building practices. Learn about eco-friendly materials, energy efficiency, and LEED certification.',
    target_audience: 'Developers, architects, environmentally conscious buyers',
    cover_image: null,
  },
  {
    id: 'evt003',
    event_title: 'Real Estate Investor Networking Night',
    sponsor_name: 'Global Property Solutions',
    event_type: 'Networking',
    requested_date: '2026-02-10T18:00:00Z',
    submitted_date: '2026-01-06T09:15:00Z',
    status: 'in_review',
    location: 'Sky Lounge, London',
    expected_attendees: '100',
    description: 'Connect with fellow real estate investors, developers, and industry professionals in an exclusive networking event. Share insights, discover opportunities, and build valuable relationships.',
    target_audience: 'Real estate investors, developers, brokers',
    cover_image: null,
  },
  {
    id: 'evt004',
    event_title: 'First-Time Homebuyer Workshop',
    sponsor_name: 'Prime Properties International',
    event_type: 'Workshop',
    requested_date: '2026-03-05T10:00:00Z',
    submitted_date: '2026-01-10T11:30:00Z',
    status: 'new',
    location: 'Community Center, Sydney',
    expected_attendees: '75',
    description: 'A comprehensive workshop designed for first-time homebuyers. Learn about mortgage options, home inspection, negotiation strategies, and the buying process from start to finish.',
    target_audience: 'First-time homebuyers, young professionals',
    cover_image: null,
  },
  {
    id: 'evt005',
    event_title: 'Commercial Real Estate Summit',
    sponsor_name: 'Skyline Realty Partners',
    event_type: 'Seminar',
    requested_date: '2026-03-18T09:00:00Z',
    submitted_date: '2026-01-09T13:00:00Z',
    status: 'live',
    location: 'Chicago Convention Center',
    expected_attendees: '500',
    description: 'Annual commercial real estate summit featuring keynote speakers, panel discussions, and networking opportunities. Topics include office space trends, retail transformation, and industrial logistics.',
    target_audience: 'Commercial real estate professionals, investors, developers',
    cover_image: null,
  },
  {
    id: 'evt006',
    event_title: 'Property Management Best Practices',
    sponsor_name: 'Urban Development Corp',
    event_type: 'Workshop',
    requested_date: '2026-02-25T13:00:00Z',
    submitted_date: '2026-01-05T16:45:00Z',
    status: 'rejected',
    location: 'Business Center, Miami',
    expected_attendees: '50',
    description: 'Rejected due to incomplete sponsor information and unclear event objectives.',
    target_audience: 'Property managers, landlords',
    cover_image: null,
  },
  {
    id: 'evt007',
    event_title: 'Future of Smart Homes',
    sponsor_name: 'Modern Living Developments',
    event_type: 'Webinar',
    requested_date: '2026-03-12T15:00:00Z',
    submitted_date: '2026-01-11T10:00:00Z',
    status: 'need_changes',
    location: 'Online (Microsoft Teams)',
    expected_attendees: '200',
    description: 'Explore the latest smart home technologies and automation systems. Needs revision on technical specifications and target audience definition.',
    target_audience: 'Homeowners, tech enthusiasts, developers',
    cover_image: null,
  },
];

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

  // State for event requests (using mock data)
  const [eventRequestsData, setEventRequestsData] = useState(MOCK_EVENT_REQUESTS);
  const [loading, setLoading] = useState(false);

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

    // Update event request status to approved
    setEventRequestsData((prev) =>
      prev.map((e) =>
        e.id === approveEvent.id 
          ? { 
              ...e, 
              status: 'approved',
              final_date: details.finalDate,
              placement: details.placement,
              visibility: details.visibility,
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
