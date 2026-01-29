'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { CheckCircle, X } from 'lucide-react';

// --- Success Modal Component ---
function SuccessModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Success!</h3>
                <p className="mt-2 text-sm text-gray-500">{message}</p>
                <div className="mt-5">
                    {/* Optional: Manual close button if auto-close feels too fast */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center w-full rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:text-sm"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Form Component ---
function CreateEventForm({ onCancel, onSuccess, formId = 'create-event-form', onSubmittingChange }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // Location
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    
    const [capacity, setCapacity] = useState('');
    const [eventType, setEventType] = useState('SEMINAR');
    const [status, setStatus] = useState('UPCOMING');
    
    // Arrays & Image
    const [agenda, setAgenda] = useState(['']); 
    const [amenities, setAmenities] = useState(['']); 
    const [imageUrl, setImageUrl] = useState(''); // Text input for URL
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const [errors, setErrors] = useState({});

    // Helper to format date to ISO
    const normalizeDate = (value) => {
        if (!value) return null;
        return new Date(value).toISOString();
    };

    const handleArrayChange = (setter, list, index, value) => {
        const updated = [...list];
        updated[index] = value;
        setter(updated);
    };

    const addArrayItem = (setter, list) => setter([...list, '']);
    const removeArrayItem = (setter, list, index) => setter(list.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!eventDate) newErrors.eventDate = 'Start date is required';
        if (!address.trim()) newErrors.address = 'Address is required';
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // 2. Start Submission
        onSubmittingChange?.(true);

        try {
            // 3. Prepare Payload
            const payload = {
                title,
                description,
                eventType,
                status,
                startDateTime: normalizeDate(eventDate),
                endDateTime: normalizeDate(endDate),
                location: {
                    address,
                    city,
                    country,
                    coordinates: {
                        lat: parseFloat(lat) || 0,
                        lng: parseFloat(lng) || 0
                    }
                },
                capacity: capacity ? parseInt(capacity) : 0,
                requiresRegistration: true,
                isVirtual: false,
                agenda: agenda.filter(item => item.trim() !== ''),
                amenities: amenities.filter(item => item.trim() !== ''),
                contactInfo: { email: contactEmail, phone: contactPhone },
                images: imageUrl.trim() ? [imageUrl.trim()] : [] // Array of string URL
            };

            // 4. API Call
            await axios.post('/events', payload);

            // 5. Trigger Success Callback (This opens the Success Modal in parent)
            if (onSuccess) await onSuccess();

        } catch (err) {
            console.error('Create Event Error:', err);
            const msg = err.response?.data?.message || 'Failed to create event';
            alert(`Error: ${msg}`);
            onSubmittingChange?.(false); // Only stop loading on error, keep loading on success until modal closes
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className='space-y-6'>
            {/* --- Title & Description --- */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Event Title *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="Ex: Annual Tech Seminar" />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Description</label>
                    <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
            </div>

            {/* --- Dates & Type --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Start Date *</label>
                    <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    {errors.eventDate && <p className="text-xs text-red-500 mt-1">{errors.eventDate}</p>}
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>End Date</label>
                    <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Event Type</label>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                        <option value="SEMINAR">SEMINAR</option>
                        <option value="WORKSHOP">WORKSHOP</option>
                        <option value="NETWORKING">NETWORKING</option>
                        <option value="CONFERENCE">CONFERENCE</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Capacity</label>
                    <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="100" />
                </div>
            </div>

            {/* --- Location --- */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Location</h4>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Address *</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Country</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </div>
            </div>

            {/* --- Image URL --- */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Event Image URL</label>
                <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" 
                    placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                    <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-gray-100 border">
                        <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                )}
            </div>

            {/* --- Dynamic Fields (Agenda) --- */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Agenda</label>
                {agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" value={item} onChange={(e) => handleArrayChange(setAgenda, agenda, idx, e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="Activity..." />
                        {agenda.length > 1 && (
                            <button type="button" onClick={() => removeArrayItem(setAgenda, agenda, idx)} className="text-red-500"><X size={18} /></button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem(setAgenda, agenda)} className="text-sm text-blue-600 hover:text-blue-800">+ Add Item</button>
            </div>
        </form>
    );
}

// --- Main Modal Wrapper ---
export default function CreateEventModal({ isOpen, onClose, onSuccess, title, formId = 'create-event-form' }) {
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) setShowSuccess(false);
    }, [isOpen]);

    // Handle what happens when the form submits successfully
    const handleFormSuccess = async () => {
        // 1. Show Success Modal immediately
        setShowSuccess(true);
        setFormSubmitting(false);

        // 2. Trigger the Data Refresh (Parent's fetchEvents)
        // We await this so data is ready before we close the modal
        if (onSuccess) {
            await onSuccess();
        }

        // 3. Close everything after a delay so user sees the success message
        setTimeout(() => {
            onClose(); // Close the main modal
            setShowSuccess(false); // Reset success state
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Success Modal (High Z-Index) */}
            <SuccessModal 
                isOpen={showSuccess} 
                onClose={() => { onClose(); setShowSuccess(false); }} 
                message="Event created successfully!" 
            />

            {/* Main Modal (Hidden if Success is showing to prevent clutter, or keep visible behind backdrop) */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ${showSuccess ? 'invisible' : 'visible'}`}>
                <div className='relative w-full max-w-2xl rounded-xl bg-white max-h-[90vh] flex flex-col shadow-2xl'>
                    
                    {/* Header */}
                    <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl'>
                        <h3 className='text-gray-900 text-lg font-bold'>{title}</h3>
                        <button onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100'>
                            <X className='w-5 h-5 text-gray-500' />
                        </button>
                    </div>

                    {/* Body */}
                    <div className='px-6 py-6 overflow-y-auto custom-scrollbar flex-1'>
                        <CreateEventForm 
                            formId={formId} 
                            onSuccess={handleFormSuccess} 
                            onSubmittingChange={setFormSubmitting} 
                        />
                    </div>

                    {/* Footer */}
                    <div className='bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end gap-3'>
                        <button onClick={onClose} className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
                            Cancel
                        </button>
                        <button 
                            type='submit' 
                            form={formId} 
                            disabled={formSubmitting} 
                            className={`rounded-md bg-[#E6B325] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#d4a520] ${formSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {formSubmitting ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}