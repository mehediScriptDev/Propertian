'use client';

import React, { useEffect, useState } from 'react';

function toInputDateTime(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const s = d.toISOString();
        return s.slice(0, 16);
    } catch {
        return iso;
    }
}

function toISO(datetimeLocal) {
    if (!datetimeLocal) return null;
    try {
        const d = new Date(datetimeLocal);
        return d.toISOString();
    } catch {
        return datetimeLocal;
    }
}

export default function EditEventModal({ isOpen, onClose, event, onSave }) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const [form, setForm] = useState(() => ({
        title: event?.title || '',
        eventDate: toInputDateTime(event?.eventDate),
        endDate: toInputDateTime(event?.endDate),
        location: event?.location || event?.address || '',
        city: event?.city || '',
        country: event?.country || '',
        eventType: event?.eventType || event?.type || '',
        capacity: event?.capacity ?? '',
        isPublished: !!event?.isPublished,
        status: event?.status || '',
        description: event?.description || '',
    }));
    useEffect(() => {
        // reset when event changes
        setForm({
            title: event?.title || '',
            eventDate: toInputDateTime(event?.eventDate),
            endDate: toInputDateTime(event?.endDate),
            location: event?.location || event?.address || '',
            city: event?.city || '',
            country: event?.country || '',
            eventType: event?.eventType || event?.type || '',
            capacity: event?.capacity ?? '',
            isPublished: !!event?.isPublished,
            status: event?.status || '',
            description: event?.description || '',
        });
    }, [event]);

    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const handleSave = async () => {
        const payload = {
            ...event,
            title: form.title,
            eventDate: toISO(form.eventDate) || event?.eventDate,
            endDate: toISO(form.endDate) || event?.endDate,
            location: form.location,
            city: form.city,
            country: form.country,
            eventType: form.eventType,
            capacity: form.capacity,
            isPublished: form.isPublished,
            status: form.status,
            description: form.description,
        };

        if (isSaving) return; // prevent double submit

        try {
            setIsSaving(true);
            const result = onSave?.(payload);
            // If parent returned a promise, await it
            if (result && typeof result.then === 'function') {
                await result;
            }
        } catch (err) {
            console.error('Save failed', err);
            // Minimal user feedback
            try {
                alert(err?.message || 'Save failed');
            } catch (e) {
                // ignore
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
            <div className='w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto' onClick={(e) => e.stopPropagation()}>
                <div className='px-6 py-4 border-b flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>Edit Event</h3>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>✕</button>
                </div>

                <div className='p-6 space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Title</label>
                        <input value={form.title} onChange={(e) => update('title', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Start</label>
                            <input type='datetime-local' value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>End</label>
                            <input type='datetime-local' value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Location</label>
                            <input value={form.location} onChange={(e) => update('location', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>City</label>
                            <input value={form.city} onChange={(e) => update('city', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Type</label>
                        <input value={form.eventType} onChange={(e) => update('eventType', e.target.value)} className='mt-1 block w-full border rounded-md p-2' />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Description</label>
                        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className='mt-1 block w-full border rounded-md p-2' rows={4} />
                    </div>

                    <div className='flex items-center justify-end gap-3'>
                        <button onClick={onClose} disabled={isSaving} className='px-4 py-2 rounded bg-gray-100 disabled:opacity-50'>Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className='px-4 py-2 rounded bg-primary text-white disabled:opacity-50'>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
