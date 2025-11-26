'use client';

import { useState } from 'react';
import { Eye, X, MessageSquare } from 'lucide-react';

/**
 * InquiriesTable Component
 * Displays recent inquiries with status badges and actions
 *
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.inquiries - Inquiry data array
 */
export default function InquiriesTable({ title, inquiries = [] }) {
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInquiry(null);
    };

    const getStatusStyles = (status) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
            responded: 'bg-green-500/10 text-green-600 border-green-500/20',
            closed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        };
        return styles[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    };

    return (
        <>
            <div className='px-6 py-5'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full min-w-[800px]'>
                    <thead className='bg-gray-100 text-gray-900'>
                        <tr>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                                User
                            </th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                                Property
                            </th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                                Status
                            </th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                                Date
                            </th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                        {inquiries.length === 0 ? (
                            <tr>
                                <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                                    No inquiries found
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inquiry) => (
                                <tr key={inquiry.id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-900'>{inquiry.userName}</div>
                                        <div className='text-xs text-gray-500'>{inquiry.userEmail}</div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='text-sm text-gray-900 max-w-xs truncate'>
                                            {inquiry.propertyTitle || 'General Inquiry'}
                                        </div>
                                        {inquiry.propertyCity && (
                                            <div className='text-xs text-gray-500'>{inquiry.propertyCity}</div>
                                        )}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                                                inquiry.status
                                            )}`}
                                        >
                                            {inquiry.statusLabel}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {inquiry.date}
                                    </td>
                                    <td className='px-6 py-4 pl-12'>
                                        <button
                                            onClick={() => handleViewDetails(inquiry)}
                                            className='inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80'
                                        >
                                            <Eye className='h-4 w-4' />
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Inquiry Details Modal */}
            {isModalOpen && selectedInquiry && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                        onClick={handleCloseModal}
                    />

                    {/* Modal Content */}
                    <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto'>
                        {/* Header */}
                        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5 sticky top-0 bg-white z-10'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-[#d4af37]/10 rounded-lg'>
                                    <MessageSquare className='h-5 w-5 text-[#d4af37]' />
                                </div>
                                <h3 className='text-2xl font-bold text-gray-900'>Inquiry Details</h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                            >
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        {/* Content */}
                        <div className='px-6 py-6 space-y-6'>
                            {/* User & Property Info Grid */}
                            <div className='grid grid-cols-2 gap-6'>
                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                                        User Name
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900'>
                                        {selectedInquiry.userName}
                                    </div>
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                                        User Email
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900'>
                                        {selectedInquiry.userEmail}
                                    </div>
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                                        Property
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900'>
                                        {selectedInquiry.propertyTitle || 'General Inquiry'}
                                    </div>
                                    {selectedInquiry.propertyCity && (
                                        <div className='text-sm text-gray-500 mt-1'>{selectedInquiry.propertyCity}</div>
                                    )}
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                                        Status
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900'>
                                        {selectedInquiry.statusLabel}
                                    </div>
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4 col-span-2'>
                                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                                        Date
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900'>{selectedInquiry.date}</div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                                    Message
                                </div>
                                <div className='text-sm text-gray-900 whitespace-pre-wrap leading-relaxed'>
                                    {selectedInquiry.message}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        {/* <div className='flex justify-end gap-3 border-t border-gray-200 px-6 py-4 sticky bottom-0 bg-white'>
                            <button
                                onClick={handleCloseModal}
                                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                            >
                                Close
                            </button>
                            <button className='rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c19b2d]'>
                                Respond
                            </button>
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
}
