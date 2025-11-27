'use client';

import React, { useState } from 'react';
import { Eye, X, User, Mail, Calendar, Flag, Info, MessageSquare, Edit, Trash } from 'lucide-react';
import Pagination from '../../../../../../components/dashboard/Pagination';

// Map status to badge color classes
function statusBadgeClasses(status) {
    const s = (status || '').toString().toLowerCase();
    switch (s) {
        case 'open':
            return 'bg-emerald-100 text-emerald-800';
        case 'pending':
            return 'bg-amber-100 text-amber-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        case 'high':
            return 'bg-rose-100 text-rose-800';
        default:
            return 'bg-slate-100 text-slate-800';
    }
}

// Map priority to badge color classes
function priorityBadgeClasses(priority) {
    const p = (priority || '').toString().toLowerCase();
    switch (p) {
        case 'high':
            return 'bg-rose-100 text-rose-800';
        case 'medium':
            return 'bg-amber-100 text-amber-800';
        case 'low':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-slate-100 text-slate-800';
    }
}

export default function SupportsTable({
    supports = [],
    title = 'Recent Supports',
    // optional pagination props (parent can pass these)
    currentPage,
    totalItems,
    itemsPerPage = 10,
    totalPages,
    onPageChange,
}) {
    const showFooter = typeof totalItems === 'number' || typeof onPageChange === 'function';

    // Modal state for viewing support details
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = (s) => {
        setSelectedSupport(s);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this support?')) {
            // stub: caller should implement API call or parent handler
            console.log('Delete support', id);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedSupport(null);
    };

    const renderRangeText = () => {
        if (typeof totalItems === 'number' && typeof currentPage === 'number') {
            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, totalItems);
            return `Showing ${start} to ${end} of ${totalItems} results`;
        }

        // fallback when no pagination meta: show count of supports
        return `Showing 1 to ${supports.length} results`;
    };

    return (
        <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
            {/* Header */}
            <div className='px-6 py-5 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
                </div>
            </div>

            {/* Desktop Table (hidden on small screens) */}
            <div className='hidden lg:block overflow-x-auto'>
                <table className='w-full min-w-[800px]'>
                    <thead className='bg-gray-100 text-gray-900'>
                        <tr>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>NAME</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>EMAIL</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>PRIORITY</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>STATUS</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>DATE</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {supports.map((s) => (
                            <tr key={s.id} className='border-t border-gray-100'>
                                <td className='px-6 py-4 text-sm text-gray-900'>{s.subject}</td>
                                <td className='px-6 py-4 text-sm text-gray-700'>{s.email}</td>
                                <td className='px-6 py-4 text-sm'>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${s.priority === 'high' ? 'bg-rose-100 text-rose-800 border-rose-100' : s.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-100' : 'bg-gray-100 text-gray-800 border-gray-100'}`}>{s.priority}</span>
                                </td>
                                <td className='px-6 py-4 text-sm'>
                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${s.status === 'open' ? 'bg-emerald-100 text-emerald-800 border-emerald-100' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-100' : 'bg-gray-100 text-gray-800 border-gray-100'}`}>{s.status}</span>
                                </td>
                                <td className='px-6 py-4 text-sm text-gray-700'>{s.date}</td>
                                <td className=' py-4 text-sm'>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={() => handleOpen(s)}
                                            className='inline-flex items-center justify-center p-2 rounded-md text-[#d4af37] hover:bg-gray-50'
                                            title='View'
                                        >
                                            <Eye className='h-4 w-4' />
                                        </button>

                                        <button
                                            onClick={() => console.log('Edit', s.id)}
                                            className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-50'
                                            title='Edit'
                                        >
                                            <Edit className='h-4 w-4' />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className='inline-flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-50'
                                            title='Delete'
                                        >
                                            <Trash className='h-4 w-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {supports.length === 0 && (
                            <tr>
                                <td colSpan={6} className='px-6 py-8 text-center text-sm text-gray-500'>No supports found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards (shown on small screens) */}
            <div className='lg:hidden space-y-4 p-4'>
                {supports.map((s) => (
                    <article key={s.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
                        <div className='flex items-start justify-between'>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-3'>
                                    <div className='text-sm font-semibold text-gray-900 truncate'>{s.subject}</div>
                                </div>
                                <div className='text-xs text-gray-500 mt-2'>{s.requester} · {s.email}</div>
                                <div className='text-xs text-gray-400 mt-1'>{s.date}</div>
                            </div>
                            <div className='flex flex-col items-end gap-2'>
                                <div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.priority === 'high' ? 'bg-rose-100 text-rose-800' : s.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>{s.priority}</span>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'open' ? 'bg-emerald-100 text-emerald-800' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{s.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <button onClick={() => handleOpen(s)} className='inline-flex items-center gap-2 bg-white text-[#374151] border border-gray-200 text-sm font-medium px-3 py-2 rounded-md'>
                                    <Eye className='h-4 w-4 text-[#d4af37]' />
                                    View
                                </button>
                                <button className='inline-flex items-center gap-2 border border-gray-200 text-sm px-3 py-2 rounded-md text-gray-700'>Edit</button>
                            </div>
                        </div>
                    </article>
                ))}

                {supports.length === 0 && (
                    <div className='text-center text-sm text-gray-500 py-6'>No supports found.</div>
                )}
            </div>

            {/* Footer */}
            {showFooter && (
                <div className='px-6 py-3 bg-white border-t border-gray-100'>
                    {typeof onPageChange === 'function' && typeof totalPages === 'number' ? (
                        <div className='flex items-center justify-between'>
                            <div className='text-sm text-gray-600'>{renderRangeText()}</div>
                            <div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalItems || supports.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={onPageChange}
                                    hideInfo={true}
                                    noBorder={true}
                                    translations={{
                                        showing: 'Showing',
                                        to: 'to',
                                        of: 'of',
                                        results: 'results',
                                        previous: 'Previous',
                                        next: 'Next',
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='text-sm text-gray-600'>{renderRangeText()}</div>
                    )}
                </div>
            )}

            {/* Details Modal */}
            {isModalOpen && selectedSupport && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />

                    <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <Info className='h-5 w-5 text-amber-500' />
                                <h3 className='text-2xl font-bold text-gray-900'>Support Details</h3>
                            </div>
                            <button onClick={handleClose} aria-label='Close' className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='px-6 py-6'>
                            <dl className='space-y-4'>
                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                        <Info className='h-4 w-4 text-gray-400' />
                                        Subject
                                    </dt>
                                    <dd className='mt-1 text-lg text-gray-900'>{selectedSupport.subject}</dd>
                                </div>

                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                        <User className='h-4 w-4 text-gray-400' />
                                        Requester
                                    </dt>
                                    <dd className='mt-1 text-lg text-gray-900'>{selectedSupport.requester}</dd>
                                </div>

                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                        <Mail className='h-4 w-4 text-gray-400' />
                                        Email
                                    </dt>
                                    <dd className='mt-1 text-lg text-gray-900'>{selectedSupport.email}</dd>
                                </div>

                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                        <Calendar className='h-4 w-4 text-gray-400' />
                                        Date
                                    </dt>
                                    <dd className='mt-1 text-lg text-gray-900'>{selectedSupport.date}</dd>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                            <Flag className='h-4 w-4 text-gray-400' />
                                            Priority
                                        </dt>
                                        <dd className='mt-1'>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${priorityBadgeClasses(selectedSupport.priority)}`}>
                                                {selectedSupport.priority}
                                            </span>
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                            <Info className='h-4 w-4 text-gray-400' />
                                            Status
                                        </dt>
                                        <dd className='mt-1'>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusBadgeClasses(selectedSupport.status)}`}>
                                                {selectedSupport.status}
                                            </span>
                                        </dd>
                                    </div>
                                </div>

                                {selectedSupport.message && (
                                    <div>
                                        <dt className='text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2'>
                                            <MessageSquare className='h-4 w-4 text-gray-400' />
                                            Message
                                        </dt>
                                        <dd className='mt-1 text-sm text-gray-800 whitespace-pre-wrap'>{selectedSupport.message}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
