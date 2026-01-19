


'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { useTranslation } from '@/i18n';
import { Search } from 'lucide-react';
import BookingTable from './components/BookingTable';
import BookingDetailsModal from './components/BookingDetailsModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import Pagination from '@/components/dashboard/Pagination';

export default function AllBookingsPage() {
    const params = useParams();
    const locale = params?.locale || 'en';
    const { t } = useTranslation(locale);

    // --- State: Data ---
    const [bookingsData, setBookingsData] = useState([]); // Stores ALL bookings
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- State: Filters & Pagination ---
    const [q, setQ] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

    // --- State: Modals ---
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)

    // --- 1. Fetch ALL Data (Run once on mount) ---
    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {

            const res = await axios.get('/bookings?limit=1000');

            const root = res?.data ?? {};
            const data = root?.data ?? root;

            const list = Array.isArray(data) ? data : (data?.bookings ?? []);

            setBookingsData(list);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // --- 2. Filter Data (Client-Side) ---
    const filteredBookings = useMemo(() => {
        let filtered = [...bookingsData];

        // Status Filter
        if (statusFilter && statusFilter !== 'ALL') {
            filtered = filtered.filter(b =>
                String(b?.status || '').toUpperCase() === statusFilter
            );
        }

        // Search Filter
        if (q && q.trim() !== '') {
            const query = q.toLowerCase().trim();
            filtered = filtered.filter(b => {
                const userName = `${b?.user?.firstName || ''} ${b?.user?.lastName || ''}`.toLowerCase();
                const userEmail = (b?.user?.email || b?.email || '').toLowerCase();
                const userPhone = (b?.user?.phone || b?.phone || '').toLowerCase();
                const propertyTitle = (b?.property?.title || '').toLowerCase();
                const bookingId = (b?.id || '').toLowerCase();

                return (
                    userName.includes(query) ||
                    userEmail.includes(query) ||
                    userPhone.includes(query) ||
                    propertyTitle.includes(query) ||
                    bookingId.includes(query)
                );
            });
        }

        return filtered;
    }, [bookingsData, q, statusFilter]);

    // --- 3. Paginate Data (Client-Side) ---
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBookings.slice(startIndex, endIndex);
    }, [filteredBookings, currentPage, itemsPerPage]);

    // --- Handlers ---
    const handleSearchChange = (e) => {
        setQ(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to page 1 on filter
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (id, booking, newStatus) => {
        // Optimistic Update
        setBookingsData(prev =>
            prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
        );

        try {
            const ownerId = booking?.property?.ownerId || booking?.property?.owner?.id || booking?.ownerId || booking?.owner?.id;
            const payload = { status: newStatus };
            if (ownerId) payload.ownerId = ownerId;

            await axios.put(`/bookings/${id}`, payload);
            // Optional: await fetchBookings(); // To confirm with server
        } catch (error) {
            console.error('Error updating status:', error);
            fetchBookings(); // Revert on error
            throw error;
        }
    };

    const paginationTranslations = {
        previous: t('common.previous') || 'Previous',
        next: t('common.next') || 'Next',
        showing: t('common.showing') || 'Showing',
        to: t('common.to') || 'to',
        of: t('common.of') || 'of',
        results: t('common.results') || 'results',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">All Bookings</h1>
                    <p className="text-sm text-gray-600 mt-1">List of all bookings in the system.</p>
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
                {/* Filters Bar */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-3">
                    <div className='relative flex-1 w-full'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                        <input
                            value={q}
                            onChange={handleSearchChange}
                            placeholder='Search bookings by name, email or phone'
                            className='h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                        />
                    </div>

                    <div className='mt-3 md:mt-0 md:w-44'>
                        <label className='sr-only'>Filter by status</label>
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className='w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                        >
                            <option value='ALL'>All statuses</option>
                            <option value='PENDING'>PENDING</option>
                            <option value='CONFIRMED'>CONFIRMED</option>
                            <option value='CANCELLED'>CANCELLED</option>
                            <option value='COMPLETED'>COMPLETED</option>
                        </select>
                    </div>
                </div>

                {error ? (
                    <div className="text-sm text-red-500 p-4">{error}</div>
                ) : (
                    <div>
                        {/* Table receives sliced data */}
                        <BookingTable
                            bookings={paginatedBookings}
                            loading={loading}
                            onView={(b) => { setSelectedBooking(b); setShowDetails(true); }}
                            onCancel={(b) => { setBookingToCancel(b); setShowCancelConfirm(true); }}
                            onStatusChange={handleStatusUpdate}
                        />

                        <BookingDetailsModal
                            isOpen={showDetails}
                            onClose={() => { setShowDetails(false); setSelectedBooking(null); }}
                            booking={selectedBooking}
                        />

                        <ConfirmDeleteModal
                            isOpen={showCancelConfirm}
                            onClose={() => { setShowCancelConfirm(false); setBookingToCancel(null); }}
                            itemLabel={bookingToCancel ? `${bookingToCancel.property?.title || bookingToCancel.id}` : 'booking'}
                            images={bookingToCancel?.property?.images || []}
                            onConfirm={async ({ alsoDeleteImages }) => {
                                if (!bookingToCancel) return;
                                const id = bookingToCancel.id;
                                try {
                                    // Cancel booking by updating status to CANCELLED
                                    const ownerId = bookingToCancel?.property?.ownerId || bookingToCancel?.property?.owner?.id || bookingToCancel?.ownerId || bookingToCancel?.owner?.id;
                                    const payload = { status: 'CANCELLED' };
                                    if (ownerId) payload.ownerId = ownerId;

                                    await axios.put(`/bookings/${id}`, payload);

                                    // Update local state to show CANCELLED status
                                    setBookingsData(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
                                } catch (err) {
                                    console.error('Failed to cancel booking', err);
                                    throw err;
                                } finally {
                                    setShowCancelConfirm(false);
                                    setBookingToCancel(null);
                                }
                            }}
                        />

                        {/* Pagination Controls */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredBookings.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                            showItemsPerPage={true}
                            translations={paginationTranslations}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
