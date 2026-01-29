"use client"

import React from 'react'
import { Edit, Trash2, X } from 'lucide-react'

const categoryBadgeClass = (cat) => {
    if (!cat) return 'bg-gray-100 text-gray-700'
    const key = String(cat).trim().toUpperCase()
    switch (key) {
        case 'FINANCIAL':
            return 'bg-green-100 text-green-800'
        case 'LEGAL':
            return 'bg-blue-100 text-blue-800'
        case 'RELOCATION':
            return 'bg-yellow-100 text-yellow-800'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

export default function PartnerModal({ partner, onClose, onEdit, onDelete }) {
    if (!partner) return null
    const initials = partner.name ? partner.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : ''

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-[min(92%,600px)] max-h-[90vh] overflow-auto z-10">
                <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-300" >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-amber-400 text-white flex items-center justify-center font-semibold border">
                            {initials || <span className="text-xs">No</span>}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                          
                        </div>
                    </div>

                    <div className="flex items-center gap-2">

                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2" title="Close">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">


                    <div className="md:col-span-2 space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium">ID:</span>
                                <span className="ml-2 break-all">{partner.id || '-'}</span>
                            </div>
                            <div>
                                <span className="font-medium">Category:</span>
                                <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadgeClass(partner.category)}`}>{partner.category || '-'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium">Featured:</span>
                                <span className="ml-2">{String(partner.featured ?? false)}</span>
                            </div>
                            <div>
                                <span className="font-medium">Active:</span>
                                <span className="ml-2">{String(partner.isActive ?? partner.is_active ?? false)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <span className="font-medium">Created At:</span>
                                <span className="ml-2">{partner.createdAt ? new Date(partner.createdAt).toLocaleString() : (partner.created_at ? new Date(partner.created_at).toLocaleString() : '-')}</span>
                            </div>
                            <div>
                                <span className="font-medium">Updated At:</span>
                                <span className="ml-2">{partner.updatedAt ? new Date(partner.updatedAt).toLocaleString() : (partner.updated_at ? new Date(partner.updated_at).toLocaleString() : '-')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><span className="font-medium">Email:</span> <span className="ml-2">{partner.email || '-'}</span></div>
                            <div><span className="font-medium">Phone:</span> <span className="ml-2">{partner.phone || '-'}</span></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><span className="font-medium">Address:</span> <span className="ml-2">{partner.address || '-'}</span></div>
                            <div><span className="font-medium">City:</span> <span className="ml-2">{partner.city || '-'}</span></div>
                        </div>
                        <div><span className="font-medium">Country:</span> <span className="ml-2">{partner.country || '-'}</span></div>
                        <div>
                            <span className="font-medium">Description:</span>
                            <p className="mt-2 text-gray-600 whitespace-pre-line">{partner.description || '-'}</p>
                        </div>
                        {partner.services && partner.services.length > 0 && (
                            <div>
                                <span className="font-medium">Services:</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {partner.services.map((s, i) => (
                                        <span key={i} className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
