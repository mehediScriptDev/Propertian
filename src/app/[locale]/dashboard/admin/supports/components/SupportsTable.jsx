'use client';

import React, { useState, useEffect } from 'react';
import { Eye, X, User, Mail, Calendar, Reply, Trash, MailOpen, Send } from 'lucide-react';
import Pagination from '../../../../../../components/dashboard/Pagination';
import { get, del, put, post } from '@/lib/api';

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function SupportsTable({
    title = 'Support Messages',
}) {
    // Tab state
    const [activeTab, setActiveTab] = useState('user-support');
    
    // Messages state (User Support - Inbox)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    // Sent messages state (Send Supports)
    const [sentMessages, setSentMessages] = useState([]);
    const [sentLoading, setSentLoading] = useState(false);
    const [sentCurrentPage, setSentCurrentPage] = useState(1);
    const [sentTotalItems, setSentTotalItems] = useState(0);
    const [sentTotalPages, setSentTotalPages] = useState(1);

    // Modal state for viewing message details
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);
    
    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    // Fetch messages from API (inbox)
    const fetchMessages = async (page = 1) => {
        setLoading(true);
        try {
            const response = await get(`/messages/inbox?page=${page}&limit=${itemsPerPage}`);
            if (response && response.success) {
                setMessages(response.data.messages || []);
                setUnreadCount(response.data.unreadCount || 0);
                setTotalItems(response.data.pagination?.totalItems || 0);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setCurrentPage(response.data.pagination?.currentPage || page);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch sent messages from API
    const fetchSentMessages = async (page = 1) => {
        setSentLoading(true);
        try {
            const response = await get(`/messages/sent?page=${page}&limit=${itemsPerPage}`);
            if (response && response.success) {
                setSentMessages(response.data.messages || []);
                setSentTotalItems(response.data.pagination?.totalItems || 0);
                setSentTotalPages(response.data.pagination?.totalPages || 1);
                setSentCurrentPage(response.data.pagination?.currentPage || page);
            }
        } catch (error) {
            console.error('Error fetching sent messages:', error);
            setSentMessages([]);
        } finally {
            setSentLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'user-support') {
            fetchMessages(currentPage);
        } else if (activeTab === 'send-supports') {
            fetchSentMessages(sentCurrentPage);
        }
    }, [activeTab]);

    const handleOpen = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    const handleReply = (message) => {
        setSelectedMessage(message);
        setIsReplyModalOpen(true);
    };

    const handleDelete = async (id) => {
        setConfirmMessage('Are you sure you want to delete this message?');
        setConfirmAction(() => async () => {
            try {
                await del(`/messages/${id}`);
                fetchMessages(currentPage);
                setShowConfirmModal(false);
            } catch (error) {
                console.error('Error deleting message:', error);
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setIsReplyModalOpen(false);
        setSelectedMessage(null);
        setReplyContent('');
        setIsSendingReply(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchMessages(page);
    };

    const handleSentPageChange = (page) => {
        setSentCurrentPage(page);
        fetchSentMessages(page);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await put('/messages/mark-all-read');
            // Refresh messages to update read status
            fetchMessages(currentPage);
        } catch (error) {
            console.error('Error marking all messages as read:', error);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            await put(`/messages/${messageId}/read`);
            // Refresh messages to update read status
            fetchMessages(currentPage);
            // Close modal after marking as read
            handleClose();
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleSendReply = async () => {
        if (!replyContent.trim() || !selectedMessage) return;
        
        setIsSendingReply(true);
        try {
            await post(`/messages/${selectedMessage.id}/reply`, {
                content: replyContent
            });
            // Close modal and refresh messages
            handleClose();
            fetchMessages(currentPage);
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setIsSendingReply(false);
        }
    };

    return (
        <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
            {/* Tabs */}
            <div className='border-b border-gray-200 bg-white'>
                <div className='flex'>
                    <button
                        onClick={() => setActiveTab('user-support')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'user-support'
                                ? 'border-[#d4af37] text-[#d4af37]'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                        }`}
                    >
                        User Support
                    </button>
                    <button
                        onClick={() => setActiveTab('send-supports')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'send-supports'
                                ? 'border-[#d4af37] text-[#d4af37]'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                        }`}
                    >
                        Send Supports
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'user-support' ? (
                <>
                    {/* Header */}
                    <div className='px-6 py-5 border-b border-gray-100'>
                        <div className='flex items-center justify-between flex-wrap gap-3'>
                            <div className='flex items-center gap-3'>
                                <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
                                {unreadCount > 0 && (
                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                                        {unreadCount} Unread
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className='inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#c49d2f] transition text-sm font-medium'
                                >
                                    <MailOpen className='h-4 w-4' />
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className='px-6 py-12 text-center'>
                            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d4af37] border-r-transparent'></div>
                            <p className='mt-4 text-sm text-gray-500'>Loading messages...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className='hidden lg:block overflow-x-auto'>
                                <table className='w-full min-w-[800px]'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>STATUS</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>SENDER</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>SUBJECT</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>DATE</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-100'>
                                        {messages.map((message) => {
                                            const sender = message.users_messages_senderIdTousers;
                                            const senderName = `${sender?.firstName || ''} ${sender?.lastName || ''}`.trim() || 'Unknown';
                                            
                                            return (
                                                <tr key={message.id} className={`hover:bg-gray-50 transition ${!message.isRead ? 'bg-blue-50/30' : ''}`}>
                                                    <td className='px-6 py-4'>
                                                        {message.isRead ? (
                                                            <MailOpen className='h-5 w-5 text-gray-400' title='Read' />
                                                        ) : (
                                                            <Mail className='h-5 w-5 text-blue-500' title='Unread' />
                                                        )}
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='h-10 w-10 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center text-white font-semibold text-sm'>
                                                                {senderName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className='text-sm font-medium text-gray-900'>{senderName}</div>
                                                                <div className='text-xs text-gray-500'>{sender?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                            {message.subject}
                                                        </div>
                                                        <div className='text-xs text-gray-500 mt-1 truncate max-w-md'>
                                                            {message.content}
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4 text-sm text-gray-600'>
                                                        {formatDate(message.createdAt)}
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center gap-2'>
                                                            <button
                                                                onClick={() => handleOpen(message)}
                                                                className='inline-flex items-center justify-center p-2 rounded-md text-[#d4af37] hover:bg-[#d4af37]/10 transition'
                                                                title='View Details'
                                                            >
                                                                <Eye className='h-4 w-4' />
                                                            </button>

                                                            <button
                                                                onClick={() => handleReply(message)}
                                                                className='inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:bg-blue-50 transition'
                                                                title='Reply'
                                                            >
                                                                <Reply className='h-4 w-4' />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(message.id)}
                                                                className='inline-flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-50 transition'
                                                                title='Delete'
                                                            >
                                                                <Trash className='h-4 w-4' />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {messages.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className='px-6 py-12 text-center'>
                                                    <Mail className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                                                    <p className='text-sm text-gray-500'>No messages found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className='lg:hidden space-y-4 p-4'>
                                {messages.map((message) => {
                                    const sender = message.users_messages_senderIdTousers;
                                    const senderName = `${sender?.firstName || ''} ${sender?.lastName || ''}`.trim() || 'Unknown';
                                    
                                    return (
                                        <article key={message.id} className={`bg-white border rounded-lg p-4 shadow-sm ${!message.isRead ? 'border-blue-300 bg-blue-50/20' : 'border-gray-200'}`}>
                                            <div className='flex items-start gap-3 mb-3'>
                                                <div className='h-12 w-12 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center text-white font-semibold flex-shrink-0'>
                                                    {senderName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className='min-w-0 flex-1'>
                                                    <div className='flex items-start justify-between gap-2'>
                                                        <div className='min-w-0'>
                                                            <div className={`text-sm font-semibold text-gray-900 ${!message.isRead ? 'font-bold' : ''}`}>
                                                                {senderName}
                                                            </div>
                                                            <div className='text-xs text-gray-500 mt-0.5'>{sender?.email}</div>
                                                        </div>
                                                        <div>
                                                            {message.isRead ? (
                                                                <MailOpen className='h-4 w-4 text-gray-400' />
                                                            ) : (
                                                                <Mail className='h-4 w-4 text-blue-500' />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mb-3'>
                                                <div className={`text-sm mb-1 ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {message.subject}
                                                </div>
                                                <div className='text-xs text-gray-500 line-clamp-2'>
                                                    {message.content}
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <div className='text-xs text-gray-400'>
                                                    {formatDate(message.createdAt)}
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <button 
                                                        onClick={() => handleOpen(message)} 
                                                        className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50'
                                                    >
                                                        <Eye className='h-3.5 w-3.5 text-[#d4af37]' />
                                                        View
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReply(message)} 
                                                        className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-100'
                                                    >
                                                        <Reply className='h-3.5 w-3.5' />
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}

                                {messages.length === 0 && (
                                    <div className='text-center py-12'>
                                        <Mail className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                                        <p className='text-sm text-gray-500'>No messages found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {messages.length > 0 && (
                                <div className='px-6 py-3 bg-white border-t border-gray-100'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-gray-600'>
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                                        </div>
                                        {totalPages > 1 && (
                                            <div>
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    totalItems={totalItems}
                                                    itemsPerPage={itemsPerPage}
                                                    onPageChange={handlePageChange}
                                                    hideInfo={true}
                                                    noBorder={true}
                                                    translations={{
                                                        previous: 'Previous',
                                                        next: 'Next',
                                                        page: 'Page',
                                                        of: 'of',
                                                        showing: 'Showing',
                                                        to: 'to',
                                                        results: 'results'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>
                    {/* Send Supports Tab Content */}
                    <div className='px-6 py-5 border-b border-gray-100'>
                        <h3 className='text-lg font-semibold text-gray-900'>Sent Support Messages</h3>
                    </div>

                    {sentLoading ? (
                        <div className='px-6 py-12 text-center'>
                            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d4af37] border-r-transparent'></div>
                            <p className='mt-4 text-sm text-gray-500'>Loading sent messages...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table for Send Supports */}
                            <div className='hidden lg:block overflow-x-auto'>
                                <table className='w-full min-w-[800px]'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>RECIPIENT</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>SUBJECT</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>DATE</th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-100'>
                                        {sentMessages.map((message) => {
                                            const receiver = message.users_messages_receiverIdTousers;
                                            const receiverName = `${receiver?.firstName || ''} ${receiver?.lastName || ''}`.trim() || 'Unknown';
                                            
                                            return (
                                                <tr key={message.id} className='hover:bg-gray-50 transition'>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm'>
                                                                {receiverName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className='text-sm font-medium text-gray-900'>{receiverName}</div>
                                                                <div className='text-xs text-gray-500'>{receiver?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='text-sm text-gray-900'>
                                                            {message.subject}
                                                        </div>
                                                        <div className='text-xs text-gray-500 mt-1 truncate max-w-md'>
                                                            {message.content}
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4 text-sm text-gray-600'>
                                                        {formatDate(message.createdAt)}
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        {message.isRead ? (
                                                            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'>
                                                                <MailOpen className='h-3.5 w-3.5 mr-1' />
                                                                Read
                                                            </span>
                                                        ) : (
                                                            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
                                                                <Send className='h-3.5 w-3.5 mr-1' />
                                                                Sent
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {sentMessages.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className='px-6 py-12 text-center'>
                                                    <Send className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                                                    <p className='text-sm text-gray-500'>No sent messages found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards for Send Supports */}
                            <div className='lg:hidden space-y-4 p-4'>
                                {sentMessages.map((message) => {
                                    const receiver = message.users_messages_receiverIdTousers;
                                    const receiverName = `${receiver?.firstName || ''} ${receiver?.lastName || ''}`.trim() || 'Unknown';
                                    
                                    return (
                                        <article key={message.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
                                            <div className='flex items-start gap-3 mb-3'>
                                                <div className='h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0'>
                                                    {receiverName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className='min-w-0 flex-1'>
                                                    <div className='text-sm font-semibold text-gray-900'>
                                                        {receiverName}
                                                    </div>
                                                    <div className='text-xs text-gray-500 mt-0.5'>{receiver?.email}</div>
                                                    <div className='mt-1'>
                                                        {message.isRead ? (
                                                            <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'>
                                                                <MailOpen className='h-3 w-3 mr-1' />
                                                                Read
                                                            </span>
                                                        ) : (
                                                            <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
                                                                <Send className='h-3 w-3 mr-1' />
                                                                Sent
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mb-3'>
                                                <div className='text-sm font-medium text-gray-900 mb-1'>
                                                    {message.subject}
                                                </div>
                                                <div className='text-xs text-gray-500 line-clamp-2'>
                                                    {message.content}
                                                </div>
                                            </div>

                                            <div className='text-xs text-gray-400'>
                                                {formatDate(message.createdAt)}
                                            </div>
                                        </article>
                                    );
                                })}

                                {sentMessages.length === 0 && (
                                    <div className='text-center py-12'>
                                        <Send className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                                        <p className='text-sm text-gray-500'>No sent messages found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination for Sent Messages */}
                            {sentMessages.length > 0 && (
                                <div className='px-6 py-3 bg-white border-t border-gray-100'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-gray-600'>
                                            Showing {((sentCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(sentCurrentPage * itemsPerPage, sentTotalItems)} of {sentTotalItems} results
                                        </div>
                                        {sentTotalPages > 1 && (
                                            <div>
                                                <Pagination
                                                    currentPage={sentCurrentPage}
                                                    totalPages={sentTotalPages}
                                                    totalItems={sentTotalItems}
                                                    itemsPerPage={itemsPerPage}
                                                    onPageChange={handleSentPageChange}
                                                    hideInfo={true}
                                                    noBorder={true}
                                                    translations={{
                                                        previous: 'Previous',
                                                        next: 'Next',
                                                        page: 'Page',
                                                        of: 'of',
                                                        showing: 'Showing',
                                                        to: 'to',
                                                        results: 'results'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Details Modal */}
            {isModalOpen && selectedMessage && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />

                    <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-white flex items-center justify-between border-b border-gray-200 px-6 py-5 z-10'>
                            <div className='flex items-center gap-3'>
                                <Mail className='h-5 w-5 text-[#d4af37]' />
                                <h3 className='text-2xl font-bold text-gray-900'>Message Details</h3>
                            </div>
                            <button onClick={handleClose} aria-label='Close' className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='px-6 py-6'>
                            <dl className='space-y-5'>
                                {/* Sender Info */}
                                <div className='flex items-start gap-4 pb-4 border-b'>
                                    <div className='h-14 w-14 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0'>
                                        {`${selectedMessage.users_messages_senderIdTousers?.firstName?.charAt(0) || ''}${selectedMessage.users_messages_senderIdTousers?.lastName?.charAt(0) || ''}`.toUpperCase()}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='text-lg font-semibold text-gray-900'>
                                            {`${selectedMessage.users_messages_senderIdTousers?.firstName || ''} ${selectedMessage.users_messages_senderIdTousers?.lastName || ''}`.trim() || 'Unknown Sender'}
                                        </div>
                                        <div className='text-sm text-gray-600 flex items-center gap-2 mt-1'>
                                            <Mail className='h-4 w-4' />
                                            {selectedMessage.users_messages_senderIdTousers?.email}
                                        </div>
                                        <div className='text-xs text-gray-500 flex items-center gap-2 mt-1'>
                                            <Calendar className='h-3.5 w-3.5' />
                                            {formatDate(selectedMessage.createdAt)}
                                        </div>
                                    </div>
                                    <div>
                                        {selectedMessage.isRead ? (
                                            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                                                <MailOpen className='h-3.5 w-3.5 mr-1' />
                                                Read
                                            </span>
                                        ) : (
                                            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                <Mail className='h-3.5 w-3.5 mr-1' />
                                                Unread
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2'>Subject</dt>
                                    <dd className='text-lg font-medium text-gray-900'>{selectedMessage.subject}</dd>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <dt className='text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2'>Message</dt>
                                    <dd className='text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200'>
                                        {selectedMessage.content}
                                    </dd>
                                </div>

                                {/* Replies count */}
                                {selectedMessage._count?.replies > 0 && (
                                    <div>
                                        <dt className='text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2'>Replies</dt>
                                        <dd className='text-sm text-gray-600'>{selectedMessage._count.replies} {selectedMessage._count.replies === 1 ? 'reply' : 'replies'}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Action Buttons */}
                        <div className='sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3'>
                            {!selectedMessage.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                                    className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2'
                                >
                                    <MailOpen className='h-4 w-4' />
                                    Mark as Read
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    handleClose();
                                    handleReply(selectedMessage);
                                }}
                                className='px-4 py-2 text-sm font-medium text-white bg-[#d4af37] rounded-lg hover:bg-[#c49d2f] transition flex items-center gap-2'
                            >
                                <Reply className='h-4 w-4' />
                                Reply to Message
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {isReplyModalOpen && selectedMessage && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={handleClose} />

                    <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <Reply className='h-5 w-5 text-[#d4af37]' />
                                <h3 className='text-2xl font-bold text-gray-900'>Reply to Message</h3>
                            </div>
                            <button onClick={handleClose} aria-label='Close' className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='px-6 py-6'>
                            <div className='mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                                <div className='text-xs text-gray-500 mb-1'>Replying to:</div>
                                <div className='text-sm font-medium text-gray-900'>{selectedMessage.subject}</div>
                                <div className='text-xs text-gray-600 mt-1'>From: {selectedMessage.users_messages_senderIdTousers?.email}</div>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Your Reply</label>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={8}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent resize-none'
                                        placeholder='Type your reply here...'
                                        disabled={isSendingReply}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3'>
                            <button
                                onClick={handleClose}
                                disabled={isSendingReply}
                                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReply}
                                disabled={isSendingReply || !replyContent.trim()}
                                className='px-4 py-2 text-sm font-medium text-white bg-[#d4af37] rounded-lg hover:bg-[#c49d2f] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <Send className='h-4 w-4' />
                                {isSendingReply ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <div className='absolute inset-0 bg-black/50' onClick={() => setShowConfirmModal(false)} />

                    <div className='relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl'>
                        <div className='px-6 py-5'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Confirm Action</h3>
                            <p className='text-sm text-gray-600'>{confirmMessage}</p>
                        </div>

                        <div className='bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl'>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className='px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmAction) confirmAction();
                                }}
                                className='px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition'
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
