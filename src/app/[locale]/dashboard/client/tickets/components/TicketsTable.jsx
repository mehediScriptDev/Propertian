"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, Eye, Trash2 } from "lucide-react";
import Pagination from "@/components/dashboard/Pagination";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import axiosInstance from "@/lib/axios";
import MessageViewModal from './MessageViewModal';

function TicketsTable({
  onRowClick,
  onView,
  onEdit,
  onDelete,
  getStatusIcon,
  translations = {
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    previous: "Previous",
    next: "Next",
  },
}) {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showView, setShowView] = useState(false);
  const [activeTab, setActiveTab] = useState('send');
  
  // State for sent messages
  const [sentMessages, setSentMessages] = useState([]);
  const [sentLoading, setSentLoading] = useState(true);
  const [sentCurrentPage, setSentCurrentPage] = useState(1);
  const [sentTotalPages, setSentTotalPages] = useState(1);
  const [sentTotalItems, setSentTotalItems] = useState(0);
  const [itemsPerPage] = useState(8);

  // State for received messages
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [receivedLoading, setReceivedLoading] = useState(true);
  const [receivedCurrentPage, setReceivedCurrentPage] = useState(1);
  const [receivedTotalPages, setReceivedTotalPages] = useState(1);
  const [receivedTotalItems, setReceivedTotalItems] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch sent messages
  useEffect(() => {
    if (activeTab === 'send') {
      fetchSentMessages(sentCurrentPage);
    }
  }, [activeTab, sentCurrentPage]);

  // Fetch received messages
  useEffect(() => {
    if (activeTab === 'receive') {
      fetchReceivedMessages(receivedCurrentPage);
    }
  }, [activeTab, receivedCurrentPage]);

  const fetchSentMessages = async (page) => {
    try {
      setSentLoading(true);
      const response = await axiosInstance.get(`/messages/sent?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.success) {
        setSentMessages(response.data.data.messages);
        setSentTotalPages(response.data.data.pagination.totalPages);
        setSentTotalItems(response.data.data.pagination.totalItems);
      }
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    } finally {
      setSentLoading(false);
    }
  };

  const fetchReceivedMessages = async (page) => {
    try {
      setReceivedLoading(true);
      const response = await axiosInstance.get(`/messages/inbox?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.success) {
        setReceivedMessages(response.data.data.messages);
        setReceivedTotalPages(response.data.data.pagination.totalPages);
        setReceivedTotalItems(response.data.data.pagination.totalItems);
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching received messages:', error);
    } finally {
      setReceivedLoading(false);
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setShowView(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axiosInstance.delete(`/messages/${id}`);
        // Refresh the appropriate list
        if (activeTab === 'send') {
          fetchSentMessages(sentCurrentPage);
        } else {
          fetchReceivedMessages(receivedCurrentPage);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderReadBadge = (isRead) => {
    if (isRead) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800">Read</span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">Unread</span>
    );
  };

  const displayMessages = activeTab === 'send' ? sentMessages : receivedMessages;
  const currentPage = activeTab === 'send' ? sentCurrentPage : receivedCurrentPage;
  const totalPages = activeTab === 'send' ? sentTotalPages : receivedTotalPages;
  const totalItems = activeTab === 'send' ? sentTotalItems : receivedTotalItems;
  const loading = activeTab === 'send' ? sentLoading : receivedLoading;

  // Get sender/receiver info based on tab
  const getUserInfo = (message) => {
    if (activeTab === 'send') {
      return message.users_messages_receiverIdTousers;
    } else {
      return message.users_messages_senderIdTousers;
    }
  };

  return (
    <>
    <div className="bg-white/50 rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'send'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Send Messages
            </span>
          </button>
          <button
            onClick={() => setActiveTab('receive')}
            className={`px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'receive'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Receive Messages
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">Loading messages...</p>
        </div>
      ) : displayMessages.length > 0 ? (
        <div className="overflow-x-auto">
          {/* ✅ Desktop Table */}
          <table
            className="min-w-full border-collapse hidden md:table"
            role="table"
            aria-label="Messages table"
          >
            <caption className="sr-only">List of messages</caption>
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  {activeTab === 'send' ? 'Receiver' : 'Sender'}
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Replies
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-base font-semibold text-gray-700 truncate">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayMessages.map((message) => (
                <tr
                  key={message.id}
                  onClick={() => onRowClick && onRowClick(message)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick && onRowClick(message);
                    }
                  }}
                  tabIndex={0}
                  className="hover:bg-gray-50 bg-white/50 cursor-pointer transition border-b border-gray-100"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium truncate max-w-[100px]">
                    {message.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <span className="text-gray-900 font-medium block truncate">
                        {message.subject}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {message.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">
                        {getUserInfo(message)?.firstName}{' '}
                        {getUserInfo(message)?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getUserInfo(message)?.email}
                      </p>
                      {activeTab === 'receive' && message.replyTo && (
                        <p className="text-xs text-blue-600 mt-1">
                          Re: {message.replyTo.subject}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {renderReadBadge(message.isRead)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {message._count?.replies || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(message);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Mobile Card View */}
          <div className="block md:hidden space-y-4 p-4 bg-gray-50">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => onRowClick && onRowClick(message)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick && onRowClick(message);
                  }
                }}
                role="button"
                tabIndex={0}
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex-1">
                    {message.subject}
                  </h3>
                  {renderReadBadge(message.isRead)}
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {message.content}
                </p>

                <div className="text-xs text-gray-500 space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{activeTab === 'send' ? 'To:' : 'From:'}</span>
                    <span>
                      {getUserInfo(message)?.firstName}{' '}
                      {getUserInfo(message)?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="truncate ml-2">
                      {getUserInfo(message)?.email}
                    </span>
                  </div>
                  {activeTab === 'receive' && message.replyTo && (
                    <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                      <p className="text-xs text-blue-700 font-medium">Reply to:</p>
                      <p className="text-xs text-blue-600 truncate">{message.replyTo.subject}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Replies:</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {message._count?.replies || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Date:</span>
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                    <span className="font-medium">ID:</span> {message.id}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(message);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">
            {activeTab === 'send' ? 'No sent messages found' : 'No received messages found'}
          </p>
        </div>
      )}

      {/* ✅ Pagination Bar */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => {
            if (activeTab === 'send') {
              setSentCurrentPage(page);
            } else {
              setReceivedCurrentPage(page);
            }
          }}
          translations={translations}
        />
      )}
    </div>
    {/* Message View Modal */}
    <MessageViewModal 
      show={showView} 
      message={selectedMessage}
      messageType={activeTab}
      onClose={() => setShowView(false)} 
    />
    </>
  );
}

export default React.memo(TicketsTable);
