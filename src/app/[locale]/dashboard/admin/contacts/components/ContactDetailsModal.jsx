import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export default function ContactDetailsModal({ contact, onClose }) {
    const [replyMessage, setReplyMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (contact) {
            setReplyMessage('')
            setSending(false)
            setSuccess(false)
            setError(null)
        }
    }, [contact?.id])

    if (!contact) return null

    const handleSendReply = async () => {
        const trimmedMessage = replyMessage.trim()

        if (!trimmedMessage) {
            setError('Please enter a reply message')
            return
        }

        if (trimmedMessage.length < 10) {
            setError('Reply message must be at least 10 characters')
            return
        }

        if (trimmedMessage.length > 2000) {
            setError('Reply message must not exceed 2000 characters')
            return
        }

        setSending(true)
        setError(null)
        setSuccess(false)

        try {
            const response = await axios.put(`/contact/${contact.id}/reply`, {
                replyMessage: replyMessage.trim()
            })
            console.log('Reply sent successfully:', response.data)
            setSuccess(true)
            setReplyMessage('')
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            console.error('Full error object:', err)
            console.error('Error data:', err?.data)
            console.error('Error message:', err?.message)

            let errorMsg = 'Failed to send reply'

            if (err?.data?.errors) {
                const errors = err.data.errors
                console.error('Validation errors:', errors)
                errorMsg = Object.values(errors).flat().join(', ')
            } else if (err?.data?.message) {
                errorMsg = err.data.message
            } else if (err?.message) {
                errorMsg = err.message
            }

            setError(errorMsg)
        } finally {
            setSending(false)
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg max-w-2xl w-full shadow-lg flex flex-col max-h-[80vh]'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header */}
                <div className='flex items-start justify-between gap-4 p-6 border-b border-gray-200'>
                    <div>
                        <h3 className='text-lg font-semibold'>Contact details</h3>
                        <p className='text-xs text-gray-500 mt-1'>ID: {contact.id}</p>
                    </div>
                    <div>
                        <button
                            onClick={onClose}
                            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className='flex-1 overflow-y-auto px-6 py-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800'>
                        <div>
                            <p className='font-medium'>{contact.fullName || '—'}</p>
                            <p className='text-xs text-gray-500'>{contact.email || '—'}</p>
                            <p className='text-xs text-gray-500'>
                                {contact.countryCode && contact.phone
                                    ? `${contact.countryCode} ${contact.phone}`
                                    : contact.phone || '—'}
                            </p>
                        </div>
                        <div>

                            <p className='text-xs text-gray-500 mt-2'>Status</p>
                            <p className='text-sm font-medium capitalize'>{contact.status || 'pending'}</p>
                            <p className='text-xs text-gray-500 mt-2'>Created</p>
                            <p className='text-sm'>
                                {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : '—'}
                            </p>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <h4 className='text-xs text-gray-500 uppercase'>Subject</h4>
                        <p className='mt-2 text-sm text-gray-800 font-medium'>{contact.subject || '—'}</p>
                    </div>

                    <div className='mt-4'>
                        <h4 className='text-xs text-gray-500 uppercase'>Message</h4>
                        <p className='mt-2 whitespace-pre-wrap text-sm text-gray-800'>{contact.message || '—'}</p>
                    </div>

                    <div className='mt-6 pt-6 border-t border-gray-200'>
                        <h4 className='text-sm font-semibold text-gray-900 mb-3'>Send Reply</h4>

                        {success && (
                            <div className='mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700'>
                                ✓ Reply sent successfully!
                            </div>
                        )}

                        {error && (
                            <div className='mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
                                {error}
                            </div>
                        )}

                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder='Type your reply message here... (minimum 10 characters)'
                            rows={3}
                            className='w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none'
                            disabled={sending || success}
                        />

                        <div className='flex items-center justify-between mt-2'>
                            <span className={`text-xs ${replyMessage.trim().length < 10 ? 'text-red-500' :
                                replyMessage.trim().length > 2000 ? 'text-red-500' :
                                    'text-gray-500'
                                }`}>
                                {replyMessage.trim().length} / 2000 characters
                                {replyMessage.trim().length > 0 && replyMessage.trim().length < 10 &&
                                    <span className='ml-2'>(minimum 10)</span>
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className='flex items-center justify-end gap-3 p-6 border-t rounded-2xl border-gray-200 bg-gray-50'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'
                        disabled={sending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendReply}
                        disabled={sending || success || replyMessage.trim().length < 10 || replyMessage.trim().length > 2000}
                        className='px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
            </div>
        </div>
    )
}
