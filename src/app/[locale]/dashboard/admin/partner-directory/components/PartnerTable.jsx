"use client"

import React, { useState } from 'react'
import { Eye, Edit2, Trash2, Edit } from 'lucide-react'
import PartnerModal from './modals/PartnerModal'
import ConfirmModal from './modals/ConfirmModal'

const PartnerTable = ({ partners = [], onDelete }) => {
    const [selected, setSelected] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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
    return (
        <>
            {/* Mobile Card View */}
            <div className='md:hidden space-y-4'>
                {partners.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-sm text-gray-500">
                        No partners found.
                    </div>
                ) : (
                    partners.map(p => (
                        <div key={p.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{p.createdAt || 'N/A'}</p>
                                </div>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${p.status === 'active' || p.status?.toLowerCase() === 'ongoing'
                                    ? 'bg-green-100 text-green-700'
                                    : p.status === 'inactive' || p.status?.toLowerCase() === 'completed'
                                        ? 'bg-gray-100 text-gray-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {p.status || 'Pending'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-700">
                                    <span className="text-xs text-gray-500 w-16">Email:</span>
                                    <span className="flex-1">{p.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <span className="text-xs text-gray-500 w-16">Phone:</span>
                                    <span className="flex-1">{p.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                    <span className="text-xs text-gray-500 w-16">Category:</span>
                                    <span className={`flex-1 inline-flex items-center justify-start px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadgeClass(p.category)}`}>{p.category || '-'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                <button onClick={() => setSelected(p)} className="text-gray-600 hover:text-blue-600 transition-colors p-2" title="View">
                                    <Eye className="h-5 w-5" />
                                </button>
                                <button className="text-gray-600 hover:text-blue-600 transition-colors p-2" title="Edit">
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => { setSelected(null); setConfirmDeleteId(p.id) }} className="text-gray-600 hover:text-red-600 transition-colors p-2" title="Delete">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal (separate component) */}
            {selected && (
                <PartnerModal partner={selected} onClose={() => setSelected(null)} />
            )}

            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto bg-white rounded-lg shadow'>
                <table className='w-full min-w-[800px]'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {partners.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No partners found.</td>
                            </tr>
                        ) : (
                            partners.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{p.id}</div>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{p.name}</div>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{p.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{p.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${categoryBadgeClass(p.category)}`}>{p.category || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelected(p)} className="text-gray-600 hover:text-blue-600 transition-colors p-1" title="View">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-blue-600 transition-colors p-1" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => { setSelected(null); setConfirmDeleteId(p.id) }} className=" text-red-600 transition-colors p-1" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Confirm delete modal */}
            <ConfirmModal
                open={!!confirmDeleteId}
                title="Delete partner"
                message="Are you sure you want to delete this partner? This action cannot be undone."
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={() => {
                    if (confirmDeleteId) {
                        onDelete && onDelete(confirmDeleteId)
                        setConfirmDeleteId(null)
                    }
                }}
            />
        </>
    )
}

export default PartnerTable
