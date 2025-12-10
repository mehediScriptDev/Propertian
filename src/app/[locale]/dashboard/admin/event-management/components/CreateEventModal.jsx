'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

// Inlined CreateEventForm (moved here so it's not a separate component file)
function CreateEventForm({ onCancel, formId = 'create-event-form', onSubmittingChange }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [capacity, setCapacity] = useState('');
    const [eventType, setEventType] = useState('SEMINAR');
    const [status, setStatus] = useState('UPCOMING');
    const [isPublished, setIsPublished] = useState(false);
    const [speakers, setSpeakers] = useState([{ name: '', role: '', bio: '', order: 0 }]);
    const [learningPoints, setLearningPoints] = useState([{ point: '', order: 0 }]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const normalizeDate = (value) => {
        if (!value) return null;
        const dt = new Date(value);
        return dt.toISOString().slice(0, 19);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validate = () => {
            const newErrors = {};
            if (!title || !title.toString().trim()) newErrors.title = 'Title is required';
            if (!description || !description.toString().trim()) newErrors.description = 'Description is required';
            if (!eventDate) newErrors.eventDate = 'Start date is required';
            if (!endDate) newErrors.endDate = 'End date is required';
            if (eventDate && endDate && new Date(endDate) < new Date(eventDate)) newErrors.endDate = 'End date must be after start date';
            if (!location || !location.toString().trim()) newErrors.location = 'Location is required';
            if (!address || !address.toString().trim()) newErrors.address = 'Address is required';
            if (!city || !city.toString().trim()) newErrors.city = 'City is required';
            if (!country || !country.toString().trim()) newErrors.country = 'Country is required';
            if (!capacity || Number(capacity) <= 0) newErrors.capacity = 'Capacity must be a positive number';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        if (!validate()) {
            setSubmitting(false);
            onSubmittingChange?.(false);
            const first = Object.values(errors)[0] || 'Please fill required fields';
            alert(first);
            return;
        }

        setSubmitting(true);
        onSubmittingChange?.(true);

        const payload = {
            title,
            description,
            eventDate: eventDate ? normalizeDate(eventDate) : null,
            endDate: endDate ? normalizeDate(endDate) : null,
            location,
            address,
            city,
            country,
            capacity: capacity ? Number(capacity) : undefined,
            status,
            eventType,
            isPublished,
            speakers: speakers.filter(s => s.name.trim()),
            learningPoints: learningPoints.filter(lp => lp.point.trim()),
        };
        console.log('Submitting event payload:', payload);

        try {
            const response = await axios.post('/events', payload);
            console.log('Response from backend:', response.data);

            const message = response.data?.message || 'Event created successfully';
            alert(message);
            onCancel?.();
        } catch (err) {
            console.error('Create event error:', err);
            console.error('Error response:', err?.response);
            console.error('Error data:', err?.response?.data);
            console.error('Error status:', err?.response?.status);
            
            const message = err?.response?.data?.message 
                || err?.response?.data?.error
                || err?.message 
                || 'Failed to create event';
            alert(`Error: ${message}\n\nCheck console for details.`);
        } finally {
            setSubmitting(false);
            onSubmittingChange?.(false);
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-base font-medium text-gray-700'>Title</label>
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder='Event title'
                />
                {errors.title && <p className='mt-1 text-xs text-red-600'>{errors.title}</p>}
            </div>

            <div>
                <label className='block text-base font-medium text-gray-700'>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder='Short description of the event'
                />
                {errors.description && <p className='mt-1 text-xs text-red-600'>{errors.description}</p>}
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Start Date & Time</label>
                    <input
                        type='datetime-local'
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.eventDate ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.eventDate && <p className='mt-1 text-xs text-red-600'>{errors.eventDate}</p>}
                </div>
                <div>
                    <label className='block text-base font-medium text-gray-700'>End Date & Time</label>
                    <input
                        type='datetime-local'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.endDate ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.endDate && <p className='mt-1 text-xs text-red-600'>{errors.endDate}</p>}
                </div>
            </div>

            <div>
                <label className='block text-base font-medium text-gray-700'>Location (venue)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.location ? 'border-red-500' : 'border-gray-200'}`} placeholder='Venue name' />
                {errors.location && <p className='mt-1 text-xs text-red-600'>{errors.location}</p>}
            </div>

            <div className='grid grid-cols-3 gap-3'>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.address ? 'border-red-500' : 'border-gray-200'}`} placeholder='Street address' />
                    {errors.address && <p className='mt-1 text-xs text-red-600'>{errors.address}</p>}
                </div>
                <div>
                    <label className='block text-base font-medium text-gray-700'>City</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.city ? 'border-red-500' : 'border-gray-200'}`} />
                    {errors.city && <p className='mt-1 text-xs text-red-600'>{errors.city}</p>}
                </div>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Country</label>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.country ? 'border-red-500' : 'border-gray-200'}`} />
                    {errors.country && <p className='mt-1 text-xs text-red-600'>{errors.country}</p>}
                </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Capacity</label>
                    <input type='number' min='1' value={capacity} onChange={(e) => setCapacity(e.target.value)} className={`mt-1 block w-full rounded-lg border px-3 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${errors.capacity ? 'border-red-500' : 'border-gray-200'}`} />
                    {errors.capacity && <p className='mt-1 text-xs text-red-600'>{errors.capacity}</p>}
                </div>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Type</label>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base shadow-sm'>
                        <option value='SEMINAR'>SEMINAR</option>
                        <option value='WORKSHOP'>WORKSHOP</option>
                        <option value='SHOWCASE'>SHOWCASE</option>
                        <option value='SUMMIT'>SUMMIT</option>
                        <option value='OTHER'>OTHER</option>
                    </select>
                </div>
                <div>
                    <label className='block text-base font-medium text-gray-700'>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base shadow-sm'>
                        <option value='UPCOMING'>UPCOMING</option>
                        <option value='ONGOING'>ONGOING</option>
                        <option value='COMPLETED'>COMPLETED</option>
                        <option value='CANCELLED'>CANCELLED</option>
                    </select>
                </div>
            </div>

            {/* Speakers Section */}
            <div className='border-t border-gray-300 pt-4 mt-4'>
                <div className='flex items-center justify-between mb-3'>
                    <label className='block text-base font-semibold text-gray-700'>Speakers</label>
                    <button
                        type='button'
                        onClick={() => setSpeakers([...speakers, { name: '', role: '', bio: '', order: speakers.length }])}
                        className='text-base px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200'
                    >
                        + Add Speaker
                    </button>
                </div>
                {speakers.map((speaker, idx) => (
                    <div key={idx} className='mb-3 p-3 border border-gray-300 rounded-lg bg-white shadow-sm'>
                        <div className='flex items-start justify-between mb-2'>
                            <span className='text-base font-medium text-gray-600'>Speaker {idx + 1}</span>
                            {speakers.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => setSpeakers(speakers.filter((_, i) => i !== idx))}
                                    className='text-base text-red-600 hover:text-red-800'
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <input
                            value={speaker.name}
                            onChange={(e) => {
                                const updated = [...speakers];
                                updated[idx].name = e.target.value;
                                setSpeakers(updated);
                            }}
                            placeholder='Speaker name'
                            className='mb-2 block w-full rounded border border-gray-200 px-2 py-1 text-base'
                        />
                        <input
                            value={speaker.role}
                            onChange={(e) => {
                                const updated = [...speakers];
                                updated[idx].role = e.target.value;
                                setSpeakers(updated);
                            }}
                            placeholder='Role/Title'
                            className='mb-2 block w-full rounded border border-gray-200 px-2 py-1 text-base'
                        />
                        <textarea
                            value={speaker.bio}
                            onChange={(e) => {
                                const updated = [...speakers];
                                updated[idx].bio = e.target.value;
                                setSpeakers(updated);
                            }}
                            placeholder='Bio'
                            rows={2}
                            className='block w-full rounded border border-gray-200 px-2 py-1 text-base'
                        />
                    </div>
                ))}
            </div>

            {/* Learning Points Section */}
            <div className='border-t border-gray-300 pt-4 mt-4'>
                <div className='flex items-center justify-between mb-3'>
                    <label className='block text-base font-semibold text-gray-700'>Learning Points</label>
                    <button
                        type='button'
                        onClick={() => setLearningPoints([...learningPoints, { point: '', order: learningPoints.length }])}
                        className='text-base px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200'
                    >
                        + Add Point
                    </button>
                </div>
                {learningPoints.map((lp, idx) => (
                    <div key={idx} className='mb-2 flex items-start gap-2'>
                        <input
                            value={lp.point}
                            onChange={(e) => {
                                const updated = [...learningPoints];
                                updated[idx].point = e.target.value;
                                setLearningPoints(updated);
                            }}
                            placeholder={`Learning point ${idx + 1}`}
                            className='flex-1 block rounded border border-gray-200 px-2 py-1 text-base'
                        />
                        {learningPoints.length > 1 && (
                            <button
                                type='button'
                                onClick={() => setLearningPoints(learningPoints.filter((_, i) => i !== idx))}
                                className='text-base text-red-600 hover:text-red-800 px-2'
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Publish Checkbox */}
            <div className='flex items-center gap-3'>
                <input id='publish' type='checkbox' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                <label htmlFor='publish' className='text-base text-gray-700'>Publish now</label>
            </div>

            {/* Note: footer buttons are expected to be provided by Modal.footer for sticky behavior */}
        </form>
    );
}

export default function CreateEventModal({ isOpen, onClose, title, formId = 'create-event-form' }) {
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = originalOverflow || '';
            document.body.style.paddingRight = originalPaddingRight || '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='modal-title'
                className='relative w-full max-w-2xl rounded-xl transform-gpu transition-all duration-200 ease-out scale-100 shadow-2xl bg-white max-h-[90vh] flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Sticky */}
                <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0'>
                    <div className='flex items-start gap-4'>
                        <div className='flex flex-col'>
                            <h3 id='modal-title' className='text-gray-900 text-lg md:text-2xl lg:text-3xl font-bold'>
                                {title}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label='Close'
                        className='w-9 h-9 flex items-center justify-center   transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
                    >
                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div
                    className='px-4 py-5 sm:p-6 overflow-y-auto custom-scrollbar text-gray-900 flex-1'
                    style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                >
                    <CreateEventForm formId={formId} onCancel={onClose} onSubmittingChange={setFormSubmitting} />
                </div>

                {/* Footer - Sticky */}
                <div className='bg-white px-4 py-4 sm:px-6 sm:py-6 pt-0 border-t border-gray-100 rounded-b-xl flex-shrink-0'>
                    <div className='flex items-center justify-end gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            form={formId}
                            disabled={formSubmitting}
                            className={`rounded-md bg-[#E6B325] px-4 py-2 text-sm font-semibold text-white ${formSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#d4a520]'}`}
                        >
                            {formSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
