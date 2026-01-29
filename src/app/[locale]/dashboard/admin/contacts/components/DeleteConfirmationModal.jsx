import React, { useState } from 'react'
import axios from '@/lib/axios'

export default function DeleteConfirmationModal({ contact, onClose, onDelete }) {
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState(null)

    if (!contact) return null

    const handleConfirmDelete = async () => {
        setDeleting(true)
        setError(null)

        try {
            await axios.delete(`/contact/${contact.id}`)
            onDelete()
            onClose()
        } catch (err) {
            console.error('Delete error:', err)
            let errorMsg = 'Failed to delete contact'

            if (err?.data?.errors) {
                const errors = err.data.errors
                errorMsg = Object.values(errors).flat().join(', ')
            } else if (err?.data?.message) {
                errorMsg = err.data.message
            } else if (err?.message) {
                errorMsg = err.message
            }

            setError(errorMsg)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg max-w-md w-full p-6 shadow-lg'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-start gap-4 mb-4'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
                        <svg className='w-6 h-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                        </svg>
                    </div>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>Delete Contact</h3>
                        <p className='text-sm text-gray-600'>
                            Are you sure you want to delete this contact? This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors'
                        disabled={deleting}
                    >
                        ✕
                    </button>
                </div>

                <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                    <div className='space-y-1'>
                        <p className='text-sm font-medium text-gray-900'>
                            {contact.fullName || 'N/A'}
                        </p>
                        <p className='text-xs text-gray-600'>{contact.email || 'N/A'}</p>
                        {contact.phone && (
                            <p className='text-xs text-gray-600'>
                                {contact.countryCode && contact.phone ? `${contact.countryCode} ${contact.phone}` : contact.phone}
                            </p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
                        {error}
                    </div>
                )}

                <div className='flex items-center justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        className='px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {deleting ? 'Deleting...' : 'Delete Contact'}
                    </button>
                </div>
            </div>
        </div>
    )
}
