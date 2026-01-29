import React, { useEffect, useRef } from 'react';
import Modal from '@/components/Modal';
import { MessageSquare, User, Mail, Calendar, Hash, Reply } from 'lucide-react';

export default function MessageViewModal({ show = false, onClose = () => {}, message = null, messageType = 'send' }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (show) {
      // focus the content container for accessibility
      contentRef.current?.focus();
    }
  }, [show]);

  if (!message) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderReadBadge = (isRead) => {
    if (isRead) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
          Read
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
        Unread
      </span>
    );
  };

  // Get user info based on message type
  const userInfo = messageType === 'send' 
    ? message.users_messages_receiverIdTousers 
    : message.users_messages_senderIdTousers;
  
  const userLabel = messageType === 'send' ? 'Receiver' : 'Sender';

  return (
    <Modal isOpen={show} onClose={onClose} title="Message Details" maxWidth="max-w-3xl">
      <div ref={contentRef} tabIndex={-1} className="outline-none">
        {/* Header Info Grid */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Message ID */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Hash className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Message ID</p>
                <p className="text-sm text-gray-900 font-mono break-all">{message.id}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
                {renderReadBadge(message.isRead)}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Sent Date</p>
                <p className="text-sm text-gray-900">{formatDate(message.createdAt)}</p>
              </div>
            </div>

            {/* Replies Count */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Replies</p>
                <p className="text-sm text-gray-900 font-semibold">{message._count?.replies || 0} replies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Information */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            {userLabel} Information
          </label>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">
                {userInfo?.firstName}{' '}
                {userInfo?.lastName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {userInfo?.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                {userInfo?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Reply To Information - Only show for received messages */}
        {messageType === 'receive' && message.replyTo && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Reply className="w-4 h-4" />
              In Reply To
            </label>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-semibold">Original Subject:</span>
                <span className="text-sm text-blue-900">{message.replyTo.subject}</span>
              </div>
              <div>
                <span className="text-sm text-blue-700 font-semibold block mb-1">Original Message:</span>
                <p className="text-sm text-blue-800 bg-white/50 p-2 rounded">{message.replyTo.content}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-600">
                <span>Original Date:</span>
                <span>{formatDate(message.replyTo.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border-l-4 border-blue-500">
            <p className="text-sm text-gray-900 font-medium">{message.subject}</p>
          </div>
        </div>

        {/* Message Content */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Message Content</label>
          <div className="bg-gray-50 rounded-lg px-4 py-4 min-h-[120px]">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
