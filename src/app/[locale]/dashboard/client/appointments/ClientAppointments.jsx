"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import { Plus, X, AlertTriangle } from "lucide-react";
import Modal from '@/components/Modal';
import ConciergeForm from '@/components/concierge/ConciergeForm';
import ConciergeModal from '@/components/concierge/component/ConciergeModal';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

// Lazy load heavier child components to split bundles
const AppointmentsHeader = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentsHeader'));
const AppointmentsTable = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentsTable'));
const AppointmentDetailModal = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentDetailModal'));
const NewAppointmentModal = React.lazy(() => import('../../../../../components/dashboard/client/NewAppointmentModal'));

export default function ClientAppointments() {
   
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [query, setQuery] = useState('');
    const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', appointment_type: 'Property Visit', preferred_date: '', preferred_time: '', notes: '' });
    const [showConciergeModal, setShowConciergeModal] = useState(false);
    const [showConciergeSuccess, setShowConciergeSuccess] = useState(false);

    const getStatusColor = (status) => {
        const colors = { confirmed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = { confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' };
        return labels[status] || status;
    };

    const handleStatusChange = (id, newStatus) => setAppointments((prev) => prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt)));

    // delete confirmation modal state
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

    const handleDelete = (id) => {
        // open confirmation modal
        setDeleteConfirm({ open: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ open: false, id: null });
        try {
            await api.delete(`/bookings/${id}`);
            setAppointments((prev) => prev.filter(apt => apt.id !== id));
            showToast('Booking cancelled', 'success');
        } catch (err) {
            console.error('Failed to cancel booking', err);
            const msg = err?.response?.data?.message || err?.message || 'Failed to cancel booking';
            showToast(msg, 'error');
        }
    };

    const handleCreateAppointment = () => {
        const newAppointment = { id: Math.max(...appointments.map(a => a.id), 0) + 1, ...formData, status: 'pending' };
        setAppointments((prev) => [...prev, newAppointment]);
        setFormData({ full_name: '', email: '', phone: '', appointment_type: 'Property Visit', preferred_date: '', preferred_time: '', notes: '' });
        setShowNewModal(false);
    };

    // Fetch bookings from API
    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const fetchBookings = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get('/bookings/my-bookings', {
                    params: { page: currentPage, limit: itemsPerPage },
                    signal: controller.signal,
                });

                const payload = res?.data || res;
                const bookings = payload?.bookings || [];

                // Map bookings to appointments format
                const mapped = bookings.map((booking) => ({
                    id: booking.id,
                    full_name: booking.property?.title || 'Property Booking',
                    email: '',
                    phone: '',
                    appointment_type: 'Property Booking',
                    preferred_date: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '',
                    preferred_time: booking.startDate ? new Date(booking.startDate).toLocaleTimeString() : '',
                    status: (booking.status || '').toLowerCase(),
                    notes: booking.notes || '',
                    // Additional booking details
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    totalAmount: booking.totalAmount,
                    property: booking.property,
                }));

                if (!mounted) return;

                setAppointments(mapped);

                const pagination = payload?.pagination;
                if (pagination) {
                    setTotalPages(pagination.totalPages || 1);
                    setTotalItems(pagination.totalItems || mapped.length);
                } else {
                    setTotalPages(1);
                    setTotalItems(mapped.length);
                }

                setLoading(false);
            } catch (err) {
                if (!mounted) return;
                setError(err?.message || 'Failed to load appointments');
                setLoading(false);
            }
        };

        fetchBookings();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [currentPage, itemsPerPage]);
 
    // prevent body scroll when any modal is open
    useEffect(() => {
        const open = showModal || showNewModal || showConciergeModal || showConciergeSuccess;
        const body = typeof document !== 'undefined' ? document.body : null;
        if (body) {
            if (open) body.classList.add('overflow-hidden'); else body.classList.remove('overflow-hidden');
        }
        return () => { if (body) body.classList.remove('overflow-hidden'); };
    }, [showModal, showNewModal, showConciergeModal, showConciergeSuccess]);

    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // close dropdown when clicking outside or pressing Escape
    useEffect(() => {
        function onDocClick(e) {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        }
        function onKey(e) {
            if (e.key === 'Escape') setDropdownOpen(false);
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', onDocClick);
            document.addEventListener('keydown', onKey);
        }
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [dropdownOpen]);

    // (no autofocus) keep menu items unstyled until hover

    return (
        <div className="min-h-screen space-y-6">
            <div className='bg-white/50 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200 mb-3 lg:mb-4.5'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div className='relative'>
                        <button
                            id='appointments-dropdown-btn'
                            type='button'
                            onClick={() => setDropdownOpen((s) => !s)}
                            aria-expanded={dropdownOpen}
                            aria-haspopup='true'
                            className='text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 focus:outline-none'
                        >
                            <span className='whitespace-nowrap text-black'>{t('dashboard.client.appointments') || 'All Appointments'}</span>
                            <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                                <path strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                    </div>
                    {/* <div className='flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto'>

                        <div className='relative' ref={dropdownRef}>
                            <button
                                id='appointments-new-btn'
                                type='button'
                                onClick={() => setDropdownOpen((s) => !s)}
                                aria-haspopup='true'
                                aria-expanded={dropdownOpen}
                                className='flex items-center gap-2 justify-between lg:w-44 h-10 px-3 rounded-lg bg-accent  text-black text-xs lg:text-sm font-semibold focus:outline-none'
                            >
                                <span className='truncate text-white hover:text-gray-100'>{t('dashboard.client.newAppointment') || '+ New Appointment'}</span>
                                <svg className={`w-4 h-4 text-white hover:text-gray-100 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                                    <path strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div id='appointments-dropdown-menu' className='absolute top-full right-0 mt-2 min-w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm z-50 transform origin-top-right' role='menu' aria-labelledby='appointments-new-btn'>
                                    <div className='py-1'>
                                        <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#1e3a5f] hover:text-white focus:outline-none' onClick={() => setDropdownOpen(false)} role='menuitem'>Add property</button>
                                        <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#1e3a5f] hover:text-white focus:outline-none' onClick={() => { setDropdownOpen(false); setShowConciergeModal(true); }} role='menuitem'>Consultation</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="bg-white/50 border border-gray-200 rounded-lg shadow p-6">
                <Suspense fallback={<div className="py-6">Loading header…</div>}>
                    <AppointmentsHeader count={appointments.length} query={query} onQueryChange={(q) => setQuery(q)} />
                </Suspense>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#E6B325]"></div>
                        <p className="text-sm text-gray-500">Loading appointments…</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center">
                        <p className="text-sm text-red-600">{error}</p>
                        <button 
                            onClick={() => setCurrentPage(1)} 
                            className="mt-4 px-4 py-2 bg-[#E6B325] text-white rounded-lg hover:bg-[#d4a520] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <Suspense fallback={<div className="py-6">Loading table…</div>}>
                        <AppointmentsTable appointments={appointments} query={query} onQueryChange={(q) => setQuery(q)} onView={(apt) => { setSelectedAppointment(apt); setShowModal(true); }} onEdit={(id) => { }} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                    </Suspense>
                )}
            </div>

            <Suspense fallback={null}>
                <AppointmentDetailModal appointment={selectedAppointment} show={showModal} onClose={() => setShowModal(false)} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
            </Suspense>

            <Suspense fallback={null}>
                <NewAppointmentModal show={showNewModal} onClose={() => setShowNewModal(false)} formData={formData} setFormData={setFormData} onCreate={handleCreateAppointment} />
            </Suspense>

                        {/* Cancel Booking Confirmation Modal (match inquiries confirm dialog) */}
                        {deleteConfirm.open && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                    onClick={() => setDeleteConfirm({ open: false, id: null })}
                                />

                                {/* Dialog */}
                                <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel booking</h3>
                                            <p className="text-sm text-gray-600">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-6">
                                        <button
                                            onClick={() => setDeleteConfirm({ open: false, id: null })}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                                        >
                                            Cancel booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

            {/* Concierge / Consultation modal (uses the same fields as the concierge page) */}
            <Modal isOpen={showConciergeModal} onClose={() => setShowConciergeModal(false)} title={t('concierge.contact.title') || 'Book a Consultation'} maxWidth='max-w-3xl' showCloseButton={true}>
                <ConciergeForm onClose={() => setShowConciergeModal(false)} onSuccess={() => setShowConciergeSuccess(true)} />
            </Modal>

            {showConciergeSuccess && (
                <ConciergeModal initialOpen={true} onClose={() => setShowConciergeSuccess(false)} />
            )}
        </div>
    );
}
