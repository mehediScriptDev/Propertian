import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export default function UpdateStatusModal({ contact, onClose, onUpdate }) {
    const [status, setStatus] = useState('')
    const [updating, setUpdating] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (contact) {
            setStatus((contact.status || 'UNREAD').toUpperCase())
            setUpdating(false)
            setSuccess(false)
            setError(null)
        }
    }, [contact?.id])

    if (!contact) return null

    const handleUpdateStatus = async () => {
        setUpdating(true)
        setError(null)
        setSuccess(false)

        try {
            const response = await axios.put(`/contact/${contact.id}/status`, {
                status: status
            })
            console.log('Status updated successfully:', response.data)
            setSuccess(true)
            setTimeout(() => {
                onUpdate()
                onClose()
            }, 1000)
        } catch (err) {
            console.error('Update error:', err)
            let errorMsg = 'Failed to update status'

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
            setUpdating(false)
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
                <div className='flex items-start justify-between gap-4 mb-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900'>Update Contact Status</h3>
                        <p className='text-xs text-gray-500 mt-1'>ID: {contact.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                    >
                        ✕
                    </button>
                </div>

                <div className='mb-4'>
                    <div className='mb-2'>
                        <p className='text-sm font-medium text-gray-700 mb-1'>Contact Information</p>
                        <p className='text-sm text-gray-600'>{contact.fullName || '—'}</p>
                        <p className='text-xs text-gray-500'>{contact.email || '—'}</p>
                    </div>
                </div>

                {success && (
                    <div className='mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700'>
                        ✓ Status updated successfully!
                    </div>
                )}

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
                        {error}
                    </div>
                )}

                <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Select Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={updating || success}
                        className='w-full h-12 appearance-none rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <option value='UNREAD'>Unread</option>
                        <option value='READ'>Read</option>
                        <option value='REPLIED'>Replied</option>
                    </select>
                </div>

                <div className='flex items-center justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'
                        disabled={updating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={updating || success}
                        className='px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
        </div>
    )
}
