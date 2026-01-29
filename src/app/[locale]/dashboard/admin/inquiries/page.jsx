'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, Send, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import Image from 'next/image';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

export default function AdminInquiriesPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fetch inquiries list for sidebar
  useEffect(() => {
    let mounted = true;
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const res = await api.get('/inquiries?page=1&limit=50');
        const items = res?.data?.inquiries || res?.inquiries || [];

        const threads = items.map((i) => {
          const img = i?.properties?.images && i.properties.images.length
            ? i.properties.images[0]
            : '';

          const partnerObj = i?.users || i?.owner || null;
          const partnerName = partnerObj
            ? (partnerObj.firstName ? `${partnerObj.firstName} ${partnerObj.lastName || ''}` : partnerObj.email || 'Partner')
            : i?.agentName || 'Partner';

          const partnerId = partnerObj?.id || i?.ownerId || i?.partnerId || null;

          const userObj = i?.user || i?.createdBy || {};
          const userName = userObj.firstName ? `${userObj.firstName} ${userObj.lastName || ''}` : userObj.email || 'Client';

          return {
            id: i.id || i._id,
            propertyName: i?.properties?.title || i?.properties?.name || '-',
            location: i?.properties?.address || i?.properties?.state || '',
            city: i?.properties?.city || '',
            status: (i?.status || '').toLowerCase() || 'new',
            image: img,
            lastMessage: i?.message || i?.lastMessage || '',
            userName,
            userEmail: userObj.email || '',
            partnerName,
            partnerEmail: partnerObj?.email || i?.partnerEmail || '',
            partnerId,
            timestamp: i?.createdAt || i?.updatedAt || new Date().toISOString(),
            inquiries: [], // Will be populated on selection
          };
        });

        if (mounted) setInquiries(threads);
      } catch (err) {
        console.error('Failed to fetch admin inquiries', err);
        showToast({ type: 'error', message: 'Failed to load inquiries.' });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInquiries();
    return () => {
      mounted = false;
    };
  }, [locale]);

  // Fetch specific conversation details (Image 2 Logic)
  const fetchThreadDetails = async (thread) => {
    setLoadingConversation(true);
    try {
      // API Call based on Image 2: GET /inquiries/:id
      const res = await api.get(`/inquiries/${thread.id}`);

      // Accessing conversation from the response structure shown in Image 2
      const conversationData = res?.data?.conversation || res?.conversation || [];

      const mappedMessages = conversationData.map((m) => {
        // Determine role based on 'senderRole' or 'isAdmin' flag
        let from = 'user';
        if (m.isAdmin || m.senderRole === 'SUPER_ADMIN' || m.senderRole === 'ADMIN') {
          from = 'admin';
        } else if (m.senderRole === 'AGENT' || m.senderRole === 'PARTNER' || m.senderRole === 'owner') {
          from = 'partner';
        }

        return {
          id: m.id || Date.now() + Math.random(),
          from: from,
          senderName: m.senderName || (from === 'admin' ? 'Admin' : m.senderRole),
          text: m.message || '',
          timestamp: new Date(m.createdAt).toLocaleString(),
          senderRole: m.senderRole
        };
      });

      // Update the selected thread with full conversation
      setSelected(prev => ({
        ...prev,
        inquiries: mappedMessages
      }));

    } catch (err) {
      console.error("Failed to load conversation", err);
      showToast({ type: 'error', message: "Failed to load conversation details" });
    } finally {
      setLoadingConversation(false);
      // Scroll to bottom after loading
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  // Select Thread Handler
  const selectThread = (thread) => {
    // Set basic info immediately
    setSelected({ ...thread, inquiries: [] });
    setIsOpen(true);

    // Fetch full conversation details
    fetchThreadDetails(thread);
  };

  // Manual Refresh Handler
  const handleRefresh = () => {
    if (selected) {
      fetchThreadDetails(selected);
    }
  };

  // Send Admin Reply (Image 3 Logic)
  const sendAdminReply = async () => {
    if (!selected || !replyText.trim()) return;

    setIsSending(true);
    try {
      // API Call based on Image 3: POST /inquiries/:id/replies
      const payload = { message: replyText };
      const res = await api.post(`/inquiries/${selected.id}/replies`, payload);

      if (res?.data?.success || res?.success) {
        const replyData = res.data?.data?.reply || res.data?.reply;

        // Create new message object from response
        const newMsg = {
          id: replyData?.id || Date.now(),
          from: 'admin',
          senderName: replyData?.senderName || 'Admin',
          text: replyData?.message || replyText,
          timestamp: new Date(replyData?.createdAt || Date.now()).toLocaleString(),
        };

        // Update UI
        setSelected(prev => ({
          ...prev,
          inquiries: [...prev.inquiries, newMsg]
        }));

        setReplyText('');
        showToast({ type: 'success', message: 'Reply sent successfully' });

        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error("Failed to send reply", err);
      showToast({ type: 'error', message: 'Failed to send message.' });
    } finally {
      setIsSending(false);
    }
  };

  // Get unique partners for filter
  const partners = useMemo(() => {
    const uniquePartners = [];
    const partnerMap = new Map();
    inquiries.forEach((thread) => {
      if (!partnerMap.has(thread.partnerId)) {
        partnerMap.set(thread.partnerId, true);
        uniquePartners.push({ id: thread.partnerId, name: thread.partnerName });
      }
    });
    return uniquePartners;
  }, [inquiries]);

  // Filter threads
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (partnerFilter !== 'all' && t.partnerId !== parseInt(partnerFilter) && t.partnerId !== partnerFilter)
        return false;
      if (!q) return true;
      return (
        (t.propertyName || '').toLowerCase().includes(q) ||
        (t.location || '').toLowerCase().includes(q) ||
        (t.userName || '').toLowerCase().includes(q) ||
        (t.partnerName || '').toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter, partnerFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((t) => t.status === 'new').length;
    const awaiting = inquiries.filter((t) => t.status === 'awaiting').length;
    const closed = inquiries.filter((t) => t.status === 'closed').length;
    return { total, new: newCount, awaiting, closed };
  }, [inquiries]);

  const getStatusBadge = (status) => {
    const config = {
      new: { bg: 'bg-blue-500', label: 'New' },
      awaiting: { bg: 'bg-yellow-400', label: 'Awaiting' },
      closed: { bg: 'bg-green-500', label: 'Closed' },
    };
    const s = config[status] || config.new;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${s.bg}`}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">All Inquiries</h1>
        <p className="text-sm text-gray-700 mt-2">
          Monitor all partner-client conversations across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Inquiries" value={stats.total} icon={MessageSquare} />
        <StatsCard title="New" value={stats.new} icon={AlertCircle} />
        <StatsCard title="Awaiting Reply" value={stats.awaiting} icon={Clock} />
        <StatsCard title="Closed" value={stats.closed} icon={CheckCircle} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search property, client, or partner..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
            />
          </div>

          {/* Partner Filter */}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
          >
            <option value="all">All Partners</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="awaiting">Awaiting Reply</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex gap-4 h-[calc(100vh-28rem)] relative">
        {/* Left: Inquiry Threads */}
        <div
          className={`${isOpen ? 'hidden' : 'block'
            } lg:block lg:w-96 w-full rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col lg:h-[calc(100vh-28rem)] lg:overflow-y-auto overflow-hidden`}
        >
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Inquiry Threads ({filtered.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filtered.map((thread) => (
              <button
                key={thread.id}
                onClick={() => selectThread(thread)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${selected?.id === thread.id ? 'bg-gray-50' : ''
                  }`}
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                  {thread.userName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {thread.userName}
                    </div>
                    <div className="text-xs text-gray-500 shrink-0">
                      {new Date(thread.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-primary font-medium mb-0.5 truncate">
                    Partner: {thread.partnerName}
                  </div>
                  <div className="text-xs text-gray-600 mb-0.5 truncate">
                    {thread.propertyName}
                  </div>
                  <div className="text-xs text-gray-500 truncate mb-2">
                    {thread.lastMessage}
                  </div>
                  {getStatusBadge(thread.status)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat View */}
        <div
          className={`${isOpen ? 'block' : 'hidden'
            }  flex-1 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col overflow-hidden`}
        >
          {!selected ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a thread to view conversation
            </div>
          ) : (
            <>
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Scrollable content (header + messages) */}
                <div className="overflow-y-auto pb-40 h-full flex flex-col">
                  {/* Header with Property & Partner Info (sticky within scroll area) */}
                  <div className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="relative sm:w-20 sm:h-20 w-14 h-14 rounded-md overflow-hidden bg-gray-200 shrink-0">
                        {selected.image ? (
                          <Image
                            src={selected.image}
                            alt={selected.propertyName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">{(selected.propertyName || '').charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className=" text-sm font-semibold text-gray-900">
                              {selected.propertyName}
                            </h3>
                            <div className=" text-xs text-primary font-medium">
                              Partner: {selected.partnerName}
                            </div>
                            <div className=" text-[10px] text-gray-400">
                              {selected.partnerEmail}
                            </div>
                            <div className=" text-xs text-gray-700 font-medium mt-1">
                              Client: {selected.userName}
                            </div>
                            <div className=" text-[10px] text-gray-400">
                              {selected.userEmail}
                            </div>
                          </div>

                          {/* Actions: Refresh & Close */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleRefresh}
                              disabled={loadingConversation}
                              className="rounded-full sm:p-2 p-1 bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                              title="Refresh conversation"
                            >
                              <RefreshCw className={`sm:w-5 sm:h-5 w-3.5 h-3.5 ${loadingConversation ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                              onClick={() => {
                                setSelected(null);
                                setIsOpen(false);
                              }}
                              className="rounded-full sm:p-2 p-1 bg-gray-100 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                              aria-label="Close chat"
                            >
                              <X className="sm:w-5 sm:h-5 w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  {loadingConversation ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="p-6 space-y-4 flex-1">
                      {selected.inquiries.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">No messages found in this conversation.</div>
                      )}
                      {selected.inquiries.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 ${msg.from === 'partner' || msg.from === 'admin'
                            ? 'justify-end'
                            : ''
                            }`}
                        >
                          {msg.from === 'user' && (
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold shrink-0">
                              {selected.userName[0]}
                            </div>
                          )}
                          <div
                            className={`flex-1 max-w-2xl ${msg.from === 'partner' || msg.from === 'admin'
                              ? 'text-right'
                              : ''
                              }`}
                          >
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              {msg.senderName}
                            </div>
                            <div
                              className={`inline-block rounded-lg px-4 py-2.5 text-sm ${msg.from === 'user'
                                ? 'bg-gray-100 text-gray-900'
                                : msg.from === 'admin'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-blue-500 text-white'
                                }`}
                            >
                              {msg.text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1.5">
                              {msg.timestamp}
                            </div>
                          </div>
                          {(msg.from === 'partner' || msg.from === 'admin') && (
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 ${msg.from === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            >
                              {msg.from === 'admin' ? 'A' : 'P'}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Admin Reply Input (always visible at bottom) */}
                <div className="px-6 py-3 bg-white border-t sticky bottom-0 border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      value={replyText}
                      disabled={isSending || loadingConversation}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isSending && sendAdminReply()}
                      placeholder="Admin: Send a message to intervene..."
                      className="flex-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:bg-gray-50"
                    />
                    <button
                      onClick={sendAdminReply}
                      disabled={isSending || loadingConversation || !replyText.trim()}
                      className="bg-red-500 text-white px-5 py-2.5 rounded-md text-xs lg:text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-red-300 flex items-center gap-2"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send as Admin
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}