"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'
import { useTranslation } from '@/i18n'
import { List, Search } from 'lucide-react'
import BookingTable from './components/BookingTable'
import BookingDetailsModal from './components/BookingDetailsModal'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import Pagination from '@/components/dashboard/Pagination'

export default function AllBookingsPage() {
    const params = useParams()
    const locale = params?.locale || 'en'
    const { t } = useTranslation(locale)

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [bookingToDelete, setBookingToDelete] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    

    const fetchBookings = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get('/bookings')
            console.log('bookings API response:', res)
            // API shape: { success: true, data: { bookings: [...] } }
            const root = res?.data ?? {}
            const data = root?.data ?? root
            const list = data?.bookings ?? data
            console.log('bookings list:', list)
            setBookings(Array.isArray(list) ? list : [])
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const filtered = bookings.filter(b => {
        // filter by status first
        if (statusFilter && statusFilter !== 'ALL') {
            const s = String(b?.status || '').toUpperCase()
            if (s !== statusFilter) return false
        }

        if (!q) return true
        const s = q.toLowerCase()
        const userName = `${b?.user?.firstName || ''} ${b?.user?.lastName || ''}`.trim()
        return (
            (userName || b?.name || '').toString().toLowerCase().includes(s) ||
            (b?.user?.email || b?.email || '').toString().toLowerCase().includes(s) ||
            (b?.user?.phone || b?.phone || '').toString().toLowerCase().includes(s) ||
            (b?.property?.title || b?.property?.address || '').toString().toLowerCase().includes(s) ||
            (b?.id || '').toString().toLowerCase().includes(s)
        )
    })

    // Pagination
    const ITEMS_PER_PAGE = 6
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filtered.slice(start, start + ITEMS_PER_PAGE)
    }, [filtered, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [q])

    useEffect(() => {
        setCurrentPage(1)
    }, [statusFilter])

    const handlePageChange = (page) => setCurrentPage(page)

    const handleStatusUpdate = async (id, booking, newStatus) => {
        // Optimistically update local state FIRST for instant feedback
        setBookings(prevBookings => 
            prevBookings.map(b => 
                b.id === id ? { ...b, status: newStatus } : b
            )
        )

        try {
            // Prepare payload with ownerId to avoid server errors
            const ownerId = booking?.property?.ownerId || booking?.property?.owner?.id || booking?.ownerId || booking?.owner?.id
            const payload = { status: newStatus }
            if (ownerId) payload.ownerId = ownerId

            // Make API call
            await axios.put(`/bookings/${id}`, payload)
            
            // Refetch to ensure server sync
            await fetchBookings()
        } catch (error) {
            console.error('Error updating booking status:', error)
            // On error, refetch to revert to server state
            await fetchBookings()
            throw error // Re-throw so BookingTable can show error alert
        }
    }

    const paginationTranslations = {
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">All Bookings</h1>
                    <p className="text-sm text-gray-600 mt-1">List of all bookings in the system.</p>
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-3">
                    <div className='relative flex-1 w-full'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search bookings by name, email or phone' className='h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900' />
                    </div>

                    <div className='mt-3 md:mt-0 md:w-44'>
                        <label className='sr-only'>Filter by status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className='w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900'>
                            <option value='ALL'>All statuses</option>
                            <option value='PENDING'>PENDING</option>
                            <option value='CONFIRMED'>CONFIRMED</option>
                            <option value='CANCELLED'>CANCELLED</option>
                            <option value='COMPLETED'>COMPLETED</option>
                        </select>
                    </div>
                </div>

                {error ? (
                    <div className="text-sm text-red-500">{error}</div>
                ) : (
                    <div>
                        <BookingTable
                            bookings={paginated}
                            loading={loading}
                            onView={(b) => { setSelectedBooking(b); setShowDetails(true) }}
                            onDelete={(b) => { setBookingToDelete(b); setShowDeleteConfirm(true) }}
                            onStatusChange={handleStatusUpdate}
                        />
                        <BookingDetailsModal isOpen={showDetails} onClose={() => { setShowDetails(false); setSelectedBooking(null) }} booking={selectedBooking} />
                        <ConfirmDeleteModal
                            isOpen={showDeleteConfirm}
                            onClose={() => { setShowDeleteConfirm(false); setBookingToDelete(null) }}
                            itemLabel={bookingToDelete ? `${bookingToDelete.property?.title || bookingToDelete.id}` : 'booking'}
                            images={bookingToDelete?.property?.images || []}
                            onConfirm={async ({ alsoDeleteImages }) => {
                                if (!bookingToDelete) return
                                const id = bookingToDelete.id
                                try {

                                    await axios.delete(`/bookings/${id}`)

                                    setBookings(prev => prev.filter(x => x.id !== id))


                                    if (alsoDeleteImages && Array.isArray(bookingToDelete.property?.images) && bookingToDelete.property.images.length) {
                                        try {

                                            await axios.post('/images/delete', { paths: bookingToDelete.property.images })
                                        } catch (e) {

                                            console.warn('Image delete failed', e)
                                        }
                                    }
                                } catch (err) {
                                    console.error('Failed to delete booking', err)
                                    throw err
                                } finally {
                                    setShowDeleteConfirm(false)
                                    setBookingToDelete(null)
                                }
                            }}
                        />
                        {/* Status editing moved inline to the table; modal removed */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                            translations={paginationTranslations}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
