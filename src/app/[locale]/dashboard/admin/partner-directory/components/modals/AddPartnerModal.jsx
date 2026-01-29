"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function AddPartnerModal({ open, onClose, onCreate }) {
    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        services: '', // comma-separated string in UI, convert to array on submit
        featured: false,
    })
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    if (!open) return null

    const categories = [
        'FINANCIAL', 'LEGAL', 'CONSTRUCTION', 'SERVICES', 'GOVERNMENT', 'OTHER'
    ]

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        setForm(prev => ({ ...prev, [name]: fieldValue }))
    }

    // image upload removed — only links/text fields are sent now

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name) return setErrorMessage('Name is required')
        setSubmitting(true)
        setErrorMessage('')
        try {
            const payload = {
                ...form,
                services: Array.isArray(form.services) ? form.services : String(form.services).split(',').map(s => s.trim()).filter(Boolean),
            }
            console.log('submitting payload:', payload)
            const result = await onCreate && onCreate(payload)
            console.log('create result:', result)
            setForm({ name: '', category: '', description: '', website: '', email: '', phone: '', address: '', city: '', country: '', services: '', featured: false })
            onClose && onClose()
        } catch (err) {
            console.error('create error', err)
            console.log('create error data:', err?.data || err)
            setErrorMessage(err?.data?.message || err?.message || 'Failed to create partner')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-[min(92%,600px)] max-h-[90vh] z-10 flex flex-col overflow-hidden">
                <div className="relative px-4 py-4 border-b border-gray-300">
                    <div className="max-w-full">
                        <h3 className="text-2xl font-medium text-gray-900">Add Partner</h3>
                        <p className="text-base text-gray-500 mt-1">Create a new partner entry.</p>
                    </div>
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2 rounded-full" title="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-0 flex-1 flex flex-col">
                    <div className="overflow-y-auto pr-6 pl-6 pt-6 pb-4 space-y-4 max-h-[64vh]">
                        {errorMessage && <div className="text-base text-red-600">{errorMessage}</div>}
                        <div>
                            <label className="text-base font-medium text-gray-700">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-base font-medium text-gray-700">Category</label>
                                <select name="category" value={form.category} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base">
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-base font-medium text-gray-700">Featured</label>
                                <div className="mt-1">
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                                        <span className="text-base text-gray-700">Mark as featured</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-700">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-base font-medium text-gray-700">Website</label>
                                <input name="website" value={form.website} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                            </div>
                            <div>
                                <label className="text-base font-medium text-gray-700">Email</label>
                                <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-base font-medium text-gray-700">Phone</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                            </div>
                            <div>
                                <label className="text-base font-medium text-gray-700">City</label>
                                <input name="city" value={form.city} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                            </div>
                            <div>
                                <label className="text-base font-medium text-gray-700">Country</label>
                                <input name="country" value={form.country} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                            </div>
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-700">Address</label>
                            <input name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-700">Services (comma separated)</label>
                            <input name="services" value={form.services} onChange={handleChange} placeholder="e.g. Mortgage Loans, Business Financing" className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-base" />
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-white border-t border-gray-300 flex justify-end gap-3">
                        <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-60">{submitting ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
