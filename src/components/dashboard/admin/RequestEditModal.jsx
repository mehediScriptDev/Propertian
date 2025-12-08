import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function RequestEditModal({ open, request, onClose, onSave }) {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (request) {
            setForm({
                client_name: request.client_name || '',
                client_email: request.client_email || '',
                client_phone: request.client_phone || '',
                service_type: request.service_type || '',
                property_address: request.property_address || '',
                status: request.status || '',
                description: request.description || '',
                id: request.id,
            });
        } else {
            setForm({});
        }
    }, [request]);

    if (!open) return null;

    const handleChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
    };

    const handleSubmit = () => {
        if (typeof onSave === 'function') onSave(form);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

            <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto ring-1 ring-black/5'>
                <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                    <div>
                        <h3 className='text-xl font-semibold text-gray-900'>Edit Concierge Request</h3>
                        <p className='text-sm text-gray-500 mt-1'>Update details for request <span className='font-medium'>#{form.id}</span></p>
                    </div>

                    <div>
                        <button onClick={onClose} className='inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-600 hover:bg-gray-100'>
                            <X className='h-4 w-4' />
                        </button>
                    </div>
                </div>

                <div className='p-6'>
                    <form className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <label className='block lg:col-span-2'>
                            <div className='text-sm text-gray-600'>Client name</div>
                            <input value={form.client_name || ''} onChange={handleChange('client_name')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-primary/80 focus:outline-none' />
                        </label>

                        <label className='block'>
                            <div className='text-sm text-gray-600'>Email</div>
                            <input type='email' value={form.client_email || ''} onChange={handleChange('client_email')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-primary/80 focus:outline-none' />
                        </label>

                        <label className='block'>
                            <div className='text-sm text-gray-600'>Status</div>
                            <select value={form.status || ''} onChange={handleChange('status')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/80'>
                                <option value=''>Select status</option>
                                <option value='pending'>Pending</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                                <option value='cancelled'>Cancelled</option>
                            </select>
                        </label>

                        <label className='block'>
                            <div className='text-sm text-gray-600'>Phone</div>
                            <input value={form.client_phone || ''} onChange={handleChange('client_phone')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/80' />
                        </label>

                        <label className='block'>
                            <div className='text-sm text-gray-600'>Service</div>
                            <input value={form.service_type || ''} onChange={handleChange('service_type')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/80' />
                        </label>

                        <label className='block lg:col-span-2'>
                            <div className='text-sm text-gray-600'>Property</div>
                            <input value={form.property_address || ''} onChange={handleChange('property_address')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/80' />
                        </label>
                    </form>

                    {/* Description full-width under all fields */}
                    <div className='mt-4'>
                        <label className='block'>
                            <div className='text-sm text-gray-600'>Description</div>
                            <textarea value={form.description || ''} onChange={handleChange('description')} className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/80' rows={5} />
                        </label>
                    </div>

                    <div className='mt-6 flex items-center justify-end gap-3'>
                        <button type='button' onClick={onClose} className='px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'>Cancel</button>
                        <button type='button' onClick={handleSubmit} className='px-4 py-2 rounded-md bg-[#d4af37] text-white hover:brightness-95'>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
