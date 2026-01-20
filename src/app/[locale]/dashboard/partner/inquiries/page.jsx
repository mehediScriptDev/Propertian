"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

export default function VerifiedPropertiesPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch partner inquiries from backend and map to UI shape
  useEffect(() => {
    let mounted = true;
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const res = await api.get('/inquiries?page=1&limit=50');
        console.log('partner inquiries response:', res);
        const items = res?.data?.inquiries || res?.inquiries || [];
        console.log('partner inquiries items:', items);

        const threads = items.map((i) => {
          const img = i?.properties?.images && i.properties.images.length
            ? i.properties.images[0]
            : '/buy-rent/hero.jpg';

          const userObj = i?.user || i?.users || i?.createdBy || {};
          const userName = userObj.firstName
            ? `${userObj.firstName} ${userObj.lastName || ''}`
            : userObj.email || 'User';

          let conversation = [];
          if (Array.isArray(i?.conversation) && i.conversation.length) {
            conversation = i.conversation
              .map((m) => ({
                id: m.id || Date.now() + Math.random(),
                from: m.from || (m.senderRole === 'AGENT' ? 'partner' : 'user'),
                text: m.message || m.text || '',
                createdAt: m.createdAt || m.createdAt || null,
              }))
              .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
          } else {
            conversation = [
              {
                id: i.id + '-msg',
                from: 'user',
                text: i?.message || i?.lastMessage || '',
                createdAt: i?.createdAt || Date.now(),
              },
            ];
          }

          return {
            id: i.id || i._id || Date.now() + Math.random(),
            propertyName: i?.properties?.title || i?.properties?.name || '-',
            location: i?.properties?.address || i?.properties?.state || '',
            city: i?.properties?.city || '',
            status: (i?.status || '').toLowerCase() || 'new',
            image: img,
            lastMessage: i?.message || i?.lastMessage || '',
            userName,
            userAvatar: null,
            timestamp: i?.createdAt || i?.updatedAt || new Date().toISOString(),
            inquiries: conversation,
          };
        });

        if (mounted) setInquiries(threads);
      } catch (err) {
        console.error('Failed to fetch partner inquiries', err);
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (t.propertyName || "").toLowerCase().includes(q) ||
        (t.location || "").toLowerCase().includes(q) ||
        (t.userName || "").toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter]);

  const getStatusBadge = (status) => {
    const config = {
      new: { bg: "bg-blue-500", label: "New" },
      awaiting: { bg: "bg-yellow-400", label: "Awaiting Reply" },
      closed: { bg: "bg-green-500", label: "Closed" },
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

  const selectThread = (thread) => {
    setSelected(thread);
    setIsOpen(true)
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    const messageText = replyText.trim();
    const optimisticId = `optimistic-${Date.now()}`;
    const newMsg = {
      id: optimisticId,
      from: "partner",
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    // Append optimistic message and sort
    setSelected((prev) => ({
      ...prev,
      inquiries: [...(prev?.inquiries || []), newMsg].sort(
        (a, b) => new Date(a.createdAt || a.timestamp || 0) - new Date(b.createdAt || b.timestamp || 0)
      ),
    }));

    setReplyText("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // Send to backend
    (async () => {
      setSending(true);
      try {
        const payload = { responseMessage: messageText, image: selected.image };
        const res = await api.post(`/inquiries/${selected.id}/respond`, payload);

        // Map server response to message shape
        const serverMsg = {
          id: res?.data?.id || res?.data?._id || `srv-${Date.now()}`,
          from: 'partner',
          text: res?.data?.responseMessage || messageText,
          createdAt: res?.data?.createdAt || new Date().toISOString(),
          senderName: res?.data?.senderName || 'Partner',
        };

        // Replace optimistic message with server message
        setSelected((prev) => ({
          ...prev,
          inquiries: (prev?.inquiries || []).map((m) => (m.id === optimisticId ? serverMsg : m)),
        }));

        showToast({ type: 'success', message: 'Reply sent' });
      } catch (err) {
        console.error('Failed to send reply', err);
        // Remove optimistic message on error
        setSelected((prev) => ({
          ...prev,
          inquiries: (prev?.inquiries || []).filter((m) => m.id !== optimisticId),
        }));
        showToast({ type: 'error', message: 'Failed to send reply' });
      } finally {
        setSending(false);
      }
    })();
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)] relative">
      {/* Left: Inquiry Threads Card */}
      <div className={`${isOpen ? 'hidden' : 'block'} lg:block w-96 rounded-lg overflow-y-scroll bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Inquiry Threads
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filtered.map((thread) => (
            <button
              key={thread.id}
              onClick={() => selectThread(thread)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${selected?.id === thread.id ? "bg-gray-50" : ""
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
                    {new Date(thread.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-0.5 truncate">
                  Property Title: {thread.propertyName}
                </div>
                <div className="text-xs text-gray-500 truncate mb-2">
                  Last message: {thread.lastMessage}
                </div>
                {getStatusBadge(thread.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Chat/Detail Card */}
      <div className={`${isOpen ? 'block' : 'hidden'}  flex-1 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
        {!selected ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a thread to view inquiries
          </div>
        ) : (
          <>
            {/* Property Info Card */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="relative sm:w-20 sm:h-20 w-14 h-14 rounded-md overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={selected.image}
                    alt={selected.propertyName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="sm:text-base text-sm font-semibold text-gray-900">
                        {selected.propertyName}
                      </h3>
                      <div className="sm:text-sm text-xs text-gray-500 mt-0.5">
                        {selected.location}
                      </div>
                      <div className="sm:text-sm text-xs text-gray-500">
                        {selected.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelected(null); setIsOpen(false); }} // close chat and show threads on small/medium
                        className="rounded-full sm:p-2 p-1 bg-gray-100 text-[#e6b325] focus:outline-none focus:ring-2 focus:ring-red-200"
                        aria-label="Close chat"
                      >
                        <X className="sm:w-5 sm:h-5 w-3.5 h-3.5 " />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area (chronological, mixed senders) */}
            <div className="flex-1 overflow-y-auto p-6 pb-24"> {/* reserve space for sticky input */}
              <div className="w-full">
                <div className="p-6 space-y-4">
                  {((selected.inquiries || [])
                    .slice()
                    .sort((a, b) => new Date(a.createdAt || a.timestamp || 0) - new Date(b.createdAt || b.timestamp || 0))
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.from === 'partner' ? 'justify-end' : ''}`}
                      >
                        {msg.from !== 'partner' && (
                          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold shrink-0">
                            {selected.userName ? selected.userName[0] : 'U'}
                          </div>
                        )}
                        <div className={`flex-1 max-w-2xl ${msg.from === 'partner' ? 'text-right' : ''}`}>
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            {msg.senderName || (msg.from === 'partner' ? 'Partner' : selected.userName)}
                          </div>
                          <div
                            className={`inline-block rounded-lg px-4 py-2.5 text-sm ${msg.from === 'partner' ? 'bg-[#3B82F6] text-white' : 'bg-gray-100 text-gray-900'}`}
                          >
                            {msg.text}
                          </div>
                          <div className="text-xs text-gray-500 mt-1.5">
                            {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString()}
                          </div>
                        </div>
                        {msg.from === 'partner' && (
                          <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                            P
                          </div>
                        )}
                      </div>
                    )))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Reply Input (sticky to bottom) */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message"
                  className="flex-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={sendReply}
                    className="bg-[#e6b325] text-white px-5 py-2.5 rounded-md text-xs lg:text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Send
                  </button>
                  {/* <button className="text-xs lg:text-sm text-gray-600 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Close
                  </button> */}
                </div>
              </div>
              <div className="sm:text-xs text-[9px] text-gray-400 mt-0.5 sm:mt-2 text-left sm:text-right">
                Admin can view & intervenre to respond 6 from potential buyer.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
