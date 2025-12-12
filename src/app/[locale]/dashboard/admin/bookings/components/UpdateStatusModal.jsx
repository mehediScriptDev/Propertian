"use client"

import React, { useEffect, useState } from 'react'

export default function UpdateStatusModal({ isOpen, onClose, booking, onConfirm }) {
    const [status, setStatus] = useState(booking?.status || 'PENDING')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) setStatus(booking?.status || 'PENDING')
    }, [isOpen, booking])

    if (!isOpen || !booking) return null

    const statuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
            <div className='bg-white rounded-lg w-full max-w-md p-6 shadow-lg' onClick={(e) => e.stopPropagation()}>
                <h3 className='text-lg font-semibold text-gray-900'>Update booking status</h3>
                <p className='text-sm text-gray-600 mt-2'>Booking: {booking.id}</p>

                <label className='block mt-4'>
                    <span className='text-xs text-gray-500 uppercase'>Status</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className='mt-1 w-full rounded border border-gray-200 p-2'>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                <div className='mt-6 flex justify-end gap-3'>
                    <button onClick={onClose} className='px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200'>Cancel</button>
                    <button
                        onClick={async () => {
                            setLoading(true)
                            try {
                                await onConfirm({ status })
                            } finally {
                                setLoading(false)
                            }
                        }}
                        disabled={loading}
                        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}
