'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { ChevronDown } from 'lucide-react';
import { put } from '@/lib/api';

export default function EditPropertyModal({ isOpen, onClose, property, onSave, t }) {
    const [form, setForm] = useState({
        title: '',
        price: '',
        status: 'AVAILABLE',
        images: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Update form when property changes
    useEffect(() => {
        if (property && isOpen) {
            setForm({
                title: property.title || '',
                price: property.price?.toString() || '',
                status: property.status?.toUpperCase() || 'AVAILABLE',
                images: null,
            });
            setImagePreview(property.image || null);
            setError(null);
        }
    }, [property, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(s => ({ ...s, images: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!property?.id) return;

        try {
            setIsSubmitting(true);
            setError(null);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('price', form.price);
            formData.append('status', form.status);

            if (form.images) {
                formData.append('images', form.images);
            }

            // Send PUT request to update property
            const response = await put(`/properties/${property.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.success) {
                // Call parent onSave callback to refresh data
                if (onSave) onSave(response.data);
                onClose();
            }
        } catch (err) {
            console.error('Error updating property:', err);
            setError(err.response?.data?.message || 'Failed to update property');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!property) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t?.('dashboard.admin.properties.edit') || 'Edit Property'} maxWidth='max-w-2xl'>
            <form onSubmit={handleSave} className='space-y-4'>
                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                        <p className='text-sm text-red-600'>{error}</p>
                    </div>
                )}

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Title *</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]'
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Price *</label>
                    <input
                        type='number'
                        value={form.price}
                        onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]'
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className='relative'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Status *</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                        onFocus={() => setOpenDropdown(true)}
                        onBlur={() => setOpenDropdown(false)}
                        className='w-full px-3 py-2 border appearance-none border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37]'
                        required
                        disabled={isSubmitting}
                    >
                        <option value='AVAILABLE'>Available</option>
                        <option value='PENDING'>Pending</option>
                        <option value='SOLD'>Sold</option>
                        <option value='INACTIVE'>Inactive</option>
                    </select>
                    <ChevronDown className={`pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-gray-500 transition-transform duration-200 rotate-180 ${openDropdown ? 'rotate-0!' : ''}`} />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Update Image</label>
                    <div className='border border-dashed border-gray-300 rounded-md p-4'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='w-full text-sm'
                            disabled={isSubmitting}
                        />
                        {imagePreview && (
                            <div className='mt-3'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt='Preview'
                                    className='w-full h-48 object-cover rounded-md'
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-end gap-3 pt-4 border-t'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors'
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='px-4 py-2 rounded-md bg-[#d4af37] text-white hover:bg-[#c19b2a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
