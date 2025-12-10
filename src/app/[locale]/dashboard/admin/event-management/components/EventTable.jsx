'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import EditEventModal from '@/app/[locale]/dashboard/admin/event-management/components/Modal/EditEventModal';
import Modal from '@/components/Modal';
import { del } from '@/lib/api';
import Pagination from '@/components/dashboard/Pagination';

export default function EventTable({ events = [], loading, error, t }) {
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

    const [currentPage, setCurrentPage] = useState(1);
    // keep a local copy so we can update UI immediately after delete
    const [localEvents, setLocalEvents] = useState(events || []);

    const itemsPerPage = 6;

    useEffect(() => {
        setCurrentPage(1);
        setLocalEvents(events || []);
    }, [events]);

    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || '';

    const openDetails = (event) => {
        const id = event?.id || event?._id;
        if (!id) return;
        try {
            sessionStorage.setItem(`event_${id}`, JSON.stringify(event));
        } catch (e) {
            // ignore
        }
        const path = locale ? `/${locale}/dashboard/admin/event-management/${id}` : `/dashboard/admin/event-management/${id}`;
        router.push(path);
    };

    const totalItems = localEvents.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const pagedEvents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return localEvents.slice(start, start + itemsPerPage);
    }, [localEvents, currentPage, itemsPerPage]);

    // view now navigates to details page by id using `openDetails`

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEditEvent, setSelectedEditEvent] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const openEditModal = (event) => {
        setSelectedEditEvent(event);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedEditEvent(null);
    };

    const openConfirm = (event) => {
        setSelectedDeleteEvent(event);
        setIsConfirmOpen(true);
    };

    const closeConfirm = () => {
        setIsConfirmOpen(false);
        setSelectedDeleteEvent(null);
    };

    const handleConfirmDelete = async () => {
        const event = selectedDeleteEvent;
        const id = event?.id || event?._id;
        if (!id) return;

        try {
            setDeletingId(id);
            const payload = {};
            if (event.image) payload.imagePath = event.image;

            const res = await del(`/events/${id}`, { data: payload });
            console.log('delete response:', res);

            // remove from local list so UI updates instantly
            setLocalEvents((prev) => prev.filter((ev) => (ev.id || ev._id) !== id));

            // adjust current page if needed
            const newTotal = Math.max(0, localEvents.length - 1);
            const newTotalPages = Math.max(1, Math.ceil(newTotal / itemsPerPage));
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

            // close modal
            closeConfirm();

            // still refresh server data in background
            try { router.refresh(); } catch (e) { /* ignore */ }
        } catch (err) {
            console.error('Delete failed', err);
            const msg = err?.response?.data?.message || err?.message || 'Delete failed';
            alert(msg);
        } finally {
            setDeletingId(null);
        }
    };

    // Pagination translations
    const paginationTranslations = useMemo(
        () => ({
            previous: t('common.previous'),
            next: t('common.next'),
            showing: t('common.showing'),
            to: t('common.to'),
            of: t('common.of'),
            results: t('common.results'),
        }),
        [t]
    );

    return (
        <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
            {/* Card Header */}
            <div className='px-6 py-5 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-gray-900'>All Events</h2>
                </div>
            </div>

            {/* Mobile cards (visible on small screens) */}
            <div className='md:hidden px-4 py-4 space-y-4'>
                {pagedEvents.map((event) => (
                    <div key={event.id} className='bg-white border border-gray-100 rounded-lg shadow-sm p-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-medium text-gray-900 truncate'>{event.title}</div>
                                <div className='text-xs text-gray-500 mt-1'>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : ''}</div>

                                <div className='mt-2 flex items-center justify-between'>
                                    <div className='text-sm text-gray-700 capitalize truncate'>{(event.eventType || event.type || '-').toLowerCase()}</div>
                                    <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusStyle((event.status || '').toLowerCase())}`}>{t ? (t(`dashboard.pages.eventManagement.status.${(event.status || '').toLowerCase()}`) || event.status || '-') : (event.status || '-')}</div>
                                </div>

                                <div className='mt-2 text-xs text-gray-500 truncate'>{event.location || event.address || '-'}</div>
                            </div>

                            <div className='flex items-center gap-3 ml-3'>
                                <button className='inline-flex items-center text-gray-500 hover:text-gray-700' aria-label='View' onClick={() => openDetails(event)}>
                                    <Eye className='h-4 w-4' />
                                </button>
                                <button className='inline-flex items-center text-blue-500 hover:text-blue-700' aria-label='Edit' onClick={() => openEditModal(event)}>
                                    <Edit className='h-4 w-4' />
                                </button>
                                <button className='inline-flex items-center text-red-500 hover:text-red-700' aria-label='Delete' onClick={() => openConfirm(event)}>
                                    <Trash2 className='h-4 w-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table (visible on md and larger) */}
            <div className='overflow-x-auto hidden md:block'>
                <table className='w-full min-w-[1100px]'>
                    <thead className='bg-gray-100 text-gray-900'>
                        <tr>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Title</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Type</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Date</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Location</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                        {pagedEvents.map((event) => (
                            <tr key={event.id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-6'>
                                    <div className='text-sm font-medium text-gray-900'>{event.title}</div>
                                    <div className='text-xs text-gray-500 mt-1'>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : ''}</div>
                                </td>
                                <td className='px-6 py-6 text-sm text-gray-700 capitalize'>{(event.eventType || event.type || '').toLowerCase()}</td>
                                <td className='px-6 py-6 text-sm text-gray-700'>{event.eventDate ? new Date(event.eventDate).toLocaleString() : event.date || '-'}</td>
                                <td className='px-6 py-6 text-sm text-gray-700'>{event.location || event.address || '-'}</td>
                                <td className='px-6 py-6'>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle((event.status || '').toLowerCase())}`}>
                                        {t ? (t(`dashboard.pages.eventManagement.status.${(event.status || '').toLowerCase()}`) || event.status || '-') : (event.status || '-')}
                                    </span>
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='flex items-center gap-4'>
                                        <button className='inline-flex items-center text-gray-500 hover:text-gray-700' aria-label='View' onClick={() => openDetails(event)}>
                                            <Eye className='h-4 w-4' />
                                        </button>
                                        <button className='inline-flex items-center text-blue-500 hover:text-blue-700' aria-label='Edit' onClick={() => openEditModal(event)}>
                                            <Edit className='h-4 w-4' />
                                        </button>
                                        <button className='inline-flex cursor-pointer items-center text-red-500 hover:text-red-700' aria-label='Delete' onClick={() => openConfirm(event)}>
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditEventModal
                isOpen={isEditOpen}
                onClose={closeEditModal}
                event={selectedEditEvent}
                onSave={(updated) => {
                    // default behaviour: close modal and log updated payload
                    console.log('Edit saved', updated);
                    closeEditModal();
                }}
            />

            {/* Pagination Footer */}
            <div className=''>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(p) => setCurrentPage(p)}
                    translations={paginationTranslations}
                />
            </div>

            <Modal
                isOpen={isConfirmOpen}
                onClose={closeConfirm}
                title={`Delete event`}
                footer={
                    <div className='flex items-center justify-end gap-3'>
                        <button className='px-3 py-2 bg-gray-100 rounded' onClick={closeConfirm} disabled={!!deletingId}>Cancel</button>
                        <button
                            className='px-3 py-2 bg-red-600 text-white rounded'
                            onClick={handleConfirmDelete}
                            disabled={!!deletingId}
                        >
                            {deletingId ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                }
            >
                <div>
                    <p className='text-sm text-gray-700'>Are you sure you want to delete <strong>{selectedDeleteEvent?.title || selectedDeleteEvent?.id}</strong>? This action cannot be undone.</p>
                </div>
            </Modal>
        </div>

    );
}
