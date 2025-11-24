"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import { Plus } from "lucide-react";
import Modal from '@/components/Modal';
import ConciergeForm from '@/components/concierge/ConciergeForm';

// Lazy load heavier child components to split bundles
const AppointmentsHeader = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentsHeader'));
const AppointmentsTable = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentsTable'));
const AppointmentDetailModal = React.lazy(() => import('../../../../../components/dashboard/client/AppointmentDetailModal'));
const NewAppointmentModal = React.lazy(() => import('../../../../../components/dashboard/client/NewAppointmentModal'));

export default function ClientAppointments() {
   
    const [appointments, setAppointments] = useState([
        { id: 1, full_name: 'Rahim Ahmed', email: 'rahim@example.com', phone: '01700000001', appointment_type: 'Property Visit', preferred_date: '2025-11-15', preferred_time: '10:00 AM', status: 'confirmed', notes: 'Interested in viewing the property' },
        { id: 2, full_name: 'Fatema Khan', email: 'fatema@example.com', phone: '01800000002', appointment_type: 'Consultation', preferred_date: '2025-11-16', preferred_time: '02:00 PM', status: 'pending', notes: 'Wants to learn about loan facilities' },
        { id: 3, full_name: 'Karim Saheb', email: 'karim@example.com', phone: '01900000003', appointment_type: 'Document Verification', preferred_date: '2025-11-10', preferred_time: '11:00 AM', status: 'completed', notes: 'Document verification completed' }
    ]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [query, setQuery] = useState('');
    const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', appointment_type: 'Property Visit', preferred_date: '', preferred_time: '', notes: '' });
    const [showConciergeModal, setShowConciergeModal] = useState(false);

    const getStatusColor = (status) => {
        const colors = { confirmed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-red-100 text-red-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = { confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' };
        return labels[status] || status;
    };

    const handleDelete = (id) => setAppointments((prev) => prev.filter(apt => apt.id !== id));
    const handleStatusChange = (id, newStatus) => setAppointments((prev) => prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt)));

    const handleCreateAppointment = () => {
        const newAppointment = { id: Math.max(...appointments.map(a => a.id), 0) + 1, ...formData, status: 'pending' };
        setAppointments((prev) => [...prev, newAppointment]);
        setFormData({ full_name: '', email: '', phone: '', appointment_type: 'Property Visit', preferred_date: '', preferred_time: '', notes: '' });
        setShowNewModal(false);
    };
 
    // prevent body scroll when any modal is open
    useEffect(() => {
        const open = showModal || showNewModal;
        const body = typeof document !== 'undefined' ? document.body : null;
        if (body) {
            if (open) body.classList.add('overflow-hidden'); else body.classList.remove('overflow-hidden');
        }
        return () => { if (body) body.classList.remove('overflow-hidden'); };
    }, [showModal, showNewModal]);

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
        <div className="min-h-screen bg-gray-50 space-y-6">
            <div className='bg-linear-to-r from-[#1e3a5f] to-[#2d5078] rounded-lg p-4 sm:p-6 md:p-8 shadow-sm mb-6'>
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
                            <span className='whitespace-nowrap'>{t('dashboard.client.appointments') || 'All Appointments'}</span>
                            <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                                <path strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>
                    </div>
                    <div className='flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto'>

                        <div className='relative' ref={dropdownRef}>
                            <button
                                id='appointments-new-btn'
                                type='button'
                                onClick={() => setDropdownOpen((s) => !s)}
                                aria-haspopup='true'
                                aria-expanded={dropdownOpen}
                                className='flex items-center gap-2 justify-between w-44 h-10 px-3 rounded-lg bg-[#d4af37] hover:bg-[#c19b2a] text-black text-sm font-semibold focus:outline-none'
                            >
                                <span className='truncate'>{t('dashboard.client.newAppointment') || '+ New Appointment'}</span>
                                <svg className={`w-4 h-4 text-black transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
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
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <Suspense fallback={<div className="py-6">Loading header…</div>}>
                    <AppointmentsHeader count={appointments.length} query={query} onQueryChange={(q) => setQuery(q)} />
                </Suspense>

                <Suspense fallback={<div className="py-6">Loading table…</div>}>
                    <AppointmentsTable appointments={appointments} query={query} onQueryChange={(q) => setQuery(q)} onView={(apt) => { setSelectedAppointment(apt); setShowModal(true); }} onEdit={(id) => { }} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                </Suspense>
            </div>

            {/* <Suspense fallback={null}>
                <AppointmentDetailModal appointment={selectedAppointment} show={showModal} onClose={() => setShowModal(false)} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
            </Suspense> */}

            <Suspense fallback={null}>
                <NewAppointmentModal show={showNewModal} onClose={() => setShowNewModal(false)} formData={formData} setFormData={setFormData} onCreate={handleCreateAppointment} />
            </Suspense>

            {/* Concierge / Consultation modal (uses the same fields as the concierge page) */}
            <Modal isOpen={showConciergeModal} onClose={() => setShowConciergeModal(false)} title={t('concierge.contact.title') || 'Book a Consultation'} maxWidth='max-w-3xl' showCloseButton={true}>
                <ConciergeForm onClose={() => setShowConciergeModal(false)} />
            </Modal>
        </div>
    );
}
