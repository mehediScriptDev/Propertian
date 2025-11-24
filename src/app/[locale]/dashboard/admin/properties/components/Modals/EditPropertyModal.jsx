'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';

export default function EditPropertyModal({ isOpen, onClose, property, onSave, t }) {
    const [form, setForm] = useState(() => ({
        title: property?.title || '',
        location: property?.location || '',
        price: property?.price || 0,
        priceUSD: property?.priceUSD || 0,
        status: property?.status || 'active',
    }));

    // keep form in sync when property changes
    if (property && form.title !== property.title) {
        setForm({
            title: property.title || '',
            location: property.location || '',
            price: property.price || 0,
            priceUSD: property.priceUSD || 0,
            status: property.status || 'active',
        });
    }

    const handleSave = () => {
        if (onSave) onSave({ ...property, ...form });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t?.('dashboard.admin.properties.edit') || 'Edit Property'} maxWidth='max-w-xl'>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className='space-y-4'>
                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Title</label>
                    <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className='w-full px-3 py-2 border border-gray-200  rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
                </div>
                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Location</label>
                    <input value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Price (FCFA)</label>
                        <input type='number' value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
                    </div>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Price (USD)</label>
                        <input type='number' value={form.priceUSD} onChange={(e) => setForm((s) => ({ ...s, priceUSD: Number(e.target.value) }))} className='w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
                    </div>
                </div>
                <div className='flex items-center justify-end gap-3'>
                    <button type='button' onClick={onClose} className='px-4 py-2 rounded-md bg-gray-100'>Cancel</button>
                    <button type='submit' className='px-4 py-2 rounded-md bg-primary text-white'>Save</button>
                </div>
            </form>
        </Modal>
    );
}
