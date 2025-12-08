import React, { useState } from 'react';
import axios from '@/lib/axios';

// Form containing only the requested fields:
// title, description, eventDate, location, address, city, country, capacity, eventType, isPublished
const CreateEventForm = ({ onCancel, formId = 'create-event-form', onSubmittingChange }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [capacity, setCapacity] = useState('');
    const [eventType, setEventType] = useState('SEMINAR');
    const [isPublished, setIsPublished] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const normalizeDate = (value) => {
        if (!value) return null;
        const dt = new Date(value);
        return dt.toISOString().slice(0, 19);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            onSubmittingChange?.(true);
        } catch (e) {
            // ignore
        }

        const payload = {
            title,
            description,
            eventDate: eventDate ? normalizeDate(eventDate) : null,
            location,
            address,
            city,
            country,
            capacity: capacity ? Number(capacity) : undefined,
            eventType,
            isPublished,
        };

        try {
            // Use the shared axios instance which includes baseURL and auth interceptors
            const res = await axios.post('/events', payload);
            // axios interceptor returns response; consider res.data if needed
            alert('Event created successfully');
            onCancel?.();
        } catch (err) {
            console.error('Create event error', err);
            // axios error format
            const message = err?.data?.message || err?.message || 'Error creating event';
            alert(message);
        } finally {
            setSubmitting(false);
            try {
                onSubmittingChange?.(false);
            } catch (e) {
                // ignore
            }
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Title</label>
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30'
                    placeholder='Event title'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30'
                    placeholder='Short description of the event'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Start (date & time)</label>
                <input
                    type='datetime-local'
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Location (venue)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30' placeholder='Venue name' />
            </div>

            <div className='grid grid-cols-3 gap-3'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30' placeholder='Street address' />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>City</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30' />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Country</label>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30' />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Capacity</label>
                    <input type='number' min='1' value={capacity} onChange={(e) => setCapacity(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30' />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Type</label>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)} className='mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm'>
                        <option value='SEMINAR'>SEMINAR</option>
                        <option value='WORKSHOP'>WORKSHOP</option>
                        <option value='SHOWCASE'>SHOWCASE</option>
                        <option value='SUMMIT'>SUMMIT</option>
                        <option value='OTHER'>OTHER</option>
                    </select>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <input id='publish' type='checkbox' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                <label htmlFor='publish' className='text-sm text-gray-700'>Publish now</label>
            </div>

            {/* Note: footer buttons are expected to be provided by Modal.footer for sticky behavior */}
        </form>
    );
};

export default CreateEventForm;
