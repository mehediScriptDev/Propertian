"use client"

import React, { useEffect, useState } from 'react'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemLabel = 'this item', images = [] }) {
    const [alsoDeleteImages, setAlsoDeleteImages] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setAlsoDeleteImages(false)
            setLoading(false)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
            <div className='bg-white rounded-lg w-full max-w-md p-6 shadow-lg' onClick={(e) => e.stopPropagation()}>
                <h3 className='text-lg font-semibold text-gray-900'>Confirm delete</h3>
                <p className='text-sm text-gray-600 mt-2'>Are you sure you want to delete {itemLabel}? This action cannot be undone.</p>

                {images && images.length > 0 && (
                    <label className='mt-4 flex items-center gap-2 text-sm text-gray-700'>
                        <input type='checkbox' checked={alsoDeleteImages} onChange={(e) => setAlsoDeleteImages(e.target.checked)} />
                        Also delete {images.length} image{images.length > 1 ? 's' : ''}
                    </label>
                )}

                <div className='mt-6 flex justify-end gap-3'>
                    <button onClick={onClose} className='px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200'>Cancel</button>
                    <button
                        onClick={async () => {
                            setLoading(true)
                            try {
                                await onConfirm({ alsoDeleteImages })
                            } finally {
                                setLoading(false)
                            }
                        }}
                        disabled={loading}
                        className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60'
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}
