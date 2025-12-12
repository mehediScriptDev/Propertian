"use client"

import React, { useEffect } from 'react'

function fmt(date) {
    try {
        if (!date) return '—'
        const d = new Date(date)
        return d.toLocaleString()
    } catch (e) {
        return String(date)
    }
}

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
    if (!booking || !isOpen) return null

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const user = booking.user || {}
    const prop = booking.property || {}

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='booking-details-title'
                className='relative w-full max-w-2xl rounded-xl transform-gpu transition-all duration-200 ease-out scale-100 shadow-2xl bg-white max-h-[90vh] overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl'>
                    <div>
                        <h3 id='booking-details-title' className='text-lg md:text-2xl font-bold text-gray-900'>Booking Details</h3>
                        {booking.id && <p className='text-xs text-gray-500 mt-1'>ID: {booking.id}</p>}
                    </div>

                    <div>
                        <button onClick={onClose} aria-label='Close' className='w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full shadow-sm hover:bg-gray-100'>
                            <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className='px-4 py-5 sm:p-6 max-h-[85vh] overflow-y-auto text-gray-900'>
                    <div className='space-y-4 text-sm'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Guest</h4>
                                <p className='mt-1 font-semibold'>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'}</p>
                                <p className='text-xs text-gray-600 mt-1'>{user.email || '—'}</p>
                                <p className='text-xs text-gray-600'>{user.phone || '—'}</p>
                            </div>

                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Property</h4>
                                <p className='mt-1 font-semibold'>{prop.title || prop.address || '—'}</p>
                                {prop.city && <p className='text-xs text-gray-600'>{prop.city}</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Check-in</h4>
                                <p className='mt-1'>{fmt(booking.startDate)}</p>
                            </div>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Check-out</h4>
                                <p className='mt-1'>{fmt(booking.endDate)}</p>
                            </div>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Status</h4>
                                <p className='mt-1 font-semibold'>{booking.status || '—'}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Total</h4>
                                <p className='mt-1 font-semibold'>{booking.totalAmount ? booking.totalAmount : '—'}</p>
                            </div>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Created</h4>
                                <p className='mt-1'>{fmt(booking.createdAt || booking.created_at)}</p>
                                <h4 className='text-xs text-gray-500 uppercase font-medium mt-3'>Updated</h4>
                                <p className='mt-1'>{fmt(booking.updatedAt || booking.updated_at)}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Property ID</h4>
                                <p className='mt-1 text-xs text-gray-400 font-mono break-all'>{booking.propertyId || booking.property_id || prop.id || '—'}</p>
                            </div>
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>User ID</h4>
                                <p className='mt-1 text-xs text-gray-400 font-mono break-all'>{booking.userId || booking.user_id || user.id || '—'}</p>
                            </div>
                        </div>

                        {booking.notes && (
                            <div>
                                <h4 className='text-xs text-gray-500 uppercase font-medium'>Notes</h4>
                                <p className='mt-1 text-sm text-gray-700 whitespace-pre-wrap'>{booking.notes}</p>
                            </div>
                        )}

                        <div className='pt-2'>
                            <h4 className='text-xs text-gray-500 uppercase font-medium'>Raw ID</h4>
                            <p className='mt-1 text-xs text-gray-400 font-mono break-all'>{booking.id}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {/* <div className='sticky bottom-0 bg-white px-4 py-4 sm:px-6 border-t border-gray-100 rounded-b-xl'>
          <div className='flex justify-end'>
            <button onClick={onClose} className='px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200'>Close</button>
          </div>
        </div> */}
            </div>
        </div>
    )
}
