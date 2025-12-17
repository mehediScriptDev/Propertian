"use client"

import React from 'react'
import Image from 'next/image'
import { Eye, Edit3, Trash2, Edit } from 'lucide-react'

const statusClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700'
    const s = String(status).toLowerCase()
    if (s.includes('pend')) return 'bg-yellow-100 text-yellow-800'
    if (s.includes('confirm') || s.includes('paid')) return 'bg-green-100 text-green-800'
    if (s.includes('cancel')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-700'
}

export default function BookingTable({ bookings = [], className = '', onView, onEdit, onDelete }) {
    return (
        <div className={className}>
            {/* Desktop / tablet: table (md+) */}
            <div className="hidden md:block overflow-x-auto">
                <table className='w-full min-w-[800px]'>
                    <thead className='bg-gray-100 text-gray-900'>
                        <tr className='text-xs text-gray-500 bg-gray-50'>
                           
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>ID</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>NAME</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>EMAIL</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>PHONE</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>PROPERTY</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>STATUS</th>
                            <th className='px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider opacity-90'>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b, i) => {
                            const id = b?.id || ''
                            const userObj = b?.user || b?.users || {}
                            const propObj = b?.property || b?.properties || {}
                            const name = `${userObj?.firstName || ''} ${userObj?.lastName || ''}`.trim() || b?.name || '—'
                            const email = userObj?.email || b?.email || '—'
                            const phone = userObj?.phone || b?.phone || '—'
                            const prop = propObj?.title || propObj?.address || '—'
                            const status = b?.status || '—'
                            const img = (Array.isArray(propObj?.images) && propObj.images[0]) || propObj?.image || '/buy-rent/thumb.png'

                            return (
                                <tr key={id || i} className='hover:bg-gray-50 transition-colors border-b border-gray-300'>
                               
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{name}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{email}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{phone}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{prop}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClasses(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-right'>
                                        <div className='inline-flex items-center gap-2 justify-end'>
                                            <button onClick={() => onView && onView(b)} title='View' className='inline-flex items-center justify-center p-1 rounded text-gray-600 hover:bg-gray-100'>
                                                <Eye className='h-4 w-4' />
                                            </button>
                                            <button onClick={() => onEdit && onEdit(b)} title='Edit' className='inline-flex items-center justify-center p-1 rounded text-blue-600 hover:bg-blue-50'>
                                                <Edit className='h-4 w-4' />
                                            </button>
                                            <button onClick={() => onDelete && onDelete(b)} title='Delete' className='inline-flex items-center justify-center p-1 rounded text-red-600 hover:bg-red-50'>
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className='p-6 text-center text-sm text-gray-500'>No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile: cards list (md hidden) */}
            <div className="md:hidden space-y-3">
                {bookings.map((b, i) => {
                    const id = b?.id || ''
                    const userObj = b?.user || b?.users || {}
                    const propObj = b?.property || b?.properties || {}
                    const name = `${userObj?.firstName || ''} ${userObj?.lastName || ''}`.trim() || b?.name || '—'
                    const email = userObj?.email || b?.email || '—'
                    const phone = userObj?.phone || b?.phone || '—'
                    const prop = propObj?.title || propObj?.address || '—'
                    const status = b?.status || '—'
                    const img = (Array.isArray(propObj?.images) && propObj.images[0]) || propObj?.image || '/buy-rent/thumb.png'

                    return (
                        <div key={id || i} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
                            <div className='flex justify-between items-start gap-3'>
                                 
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between gap-2'>
                                        <h3 className='text-sm font-semibold text-gray-900 truncate'>{name}</h3>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses(status)}`}>{status}</span>
                                    </div>
                                    <p className='mt-1 text-xs text-gray-500 truncate'>{prop}</p>
                                    <p className='mt-2 text-xs text-gray-600'>{email} · {phone}</p>
                                    <p className='mt-2 text-xs text-gray-400 font-mono truncate text-ellipsis'>{id}</p>
                                </div>
                                <div className='shrink-0 flex flex-col items-end gap-2'>
                                    <button onClick={() => onView && onView(b)} title='View' className='p-2 rounded text-gray-600 hover:bg-gray-100'>
                                        <Eye className='h-4 w-4' />
                                    </button>
                                    <button onClick={() => onEdit && onEdit(b)} title='Edit' className='p-2 rounded text-blue-600 hover:bg-blue-50'>
                                        <Edit3 className='h-4 w-4' />
                                    </button>
                                    <button onClick={() => onDelete && onDelete(b)} title='Delete' className='p-2 rounded text-red-600 hover:bg-red-50'>
                                        <Trash2 className='h-4 w-4' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
