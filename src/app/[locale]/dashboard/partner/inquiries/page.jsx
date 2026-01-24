



"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Loader2, Send, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import api from "@/lib/api";
import { showToast } from "@/components/Toast";

export default function PartnerInquiriesPage() {
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
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 1. Fetch Partner Inquiries List (Summary List)
  useEffect(() => {
    let mounted = true;
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        // API: Get inquiries list for sidebar
        const res = await api.get("/inquiries/my-inquiries?page=1&limit=50");
        const responseData = res?.data || res;
        const items = responseData?.data?.inquiries || responseData?.inquiries || [];

        const threads = items.map((i) => {
          const img =
            i?.properties?.images && i.properties.images.length
              ? i.properties.images[0]
              : "";

          // User Info
          const userObj = i?.user || i?.users || i?.createdBy || {};
          const userName = userObj.firstName
            ? `${userObj.firstName} ${userObj.lastName || ""}`
            : userObj.email || "Client";

          return {
            id: i.id || i._id,
            propertyName: i?.properties?.title || i?.properties?.name || "-",
            location: i?.properties?.address || i?.properties?.state || "",
            city: i?.properties?.city || "",
            status: (i?.status || "").toLowerCase() || "new",
            image: img,
            lastMessage: i?.message || i?.lastMessage || "",
            userName,
            timestamp: i?.createdAt || i?.updatedAt || new Date().toISOString(),
            inquiries: [], // Initially empty, will be filled by fetchThreadDetails
          };
        });

        if (mounted) setInquiries(threads);
      } catch (err) {
        console.error("Fetch error:", err);
        showToast({ type: "error", message: "Failed to load inquiries." });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInquiries();
    return () => {
      mounted = false;
    };
  }, [locale]);

  // 2. Fetch Full Conversation Details (ID Wise)
  const fetchThreadDetails = async (threadId, isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setLoadingConversation(true);
    try {
      // API Call: GET /inquiries/:id to get ALL previous conversations
      const res = await api.get(`/inquiries/${threadId}`);
      const responseData = res?.data || res;
      
      // Access the 'conversation' array from the response
      // Structure based on your image: { ..., conversation: [...] }
      const conversationData = responseData?.conversation || responseData?.data?.conversation || [];

      console.log("Full Conversation Data:", conversationData);

      const mappedMessages = conversationData.map((msg) => {
        // Role Mapping:
        // 'USER' -> Client (Left)
        // 'SUPER_ADMIN' / 'ADMIN' -> Admin (Left)
        // 'AGENT' / 'PARTNER' -> Me (Right)
        
        let from = 'partner'; // Default assume it's me
        
        if (msg.senderRole === 'USER') {
            from = 'client';
        } else if (msg.senderRole === 'SUPER_ADMIN' || msg.senderRole === 'ADMIN') {
            from = 'admin';
        } else if (msg.senderRole === 'PARTNER' || msg.senderRole === 'AGENT') {
            from = 'partner';
        }

        return {
          id: msg.id,
          from: from, 
          text: msg.message,
          timestamp: new Date(msg.createdAt).toLocaleString(),
          senderName: msg.senderName,
          senderRole: msg.senderRole
        };
      });

      // Sort by time just in case
      mappedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Update the selected thread with the FULL conversation history
      setSelected((prev) => ({
        ...prev,
        id: threadId,
        inquiries: mappedMessages,
      }));

    } catch (err) {
      console.error("Conversation fetch error:", err);
      showToast({ type: "error", message: "Failed to load conversation history." });
    } finally {
      if (!isBackgroundRefresh) setLoadingConversation(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

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
    // 1. Set basic info from list first
    setSelected({ ...thread, inquiries: [] });
    setIsOpen(true);
    
    // 2. Immediately fetch the full history from API
    fetchThreadDetails(thread.id);
  };

  // 3. Send Reply Logic
  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;

    const currentMessageText = replyText;
    setIsSending(true);

    try {
      const payload = { message: currentMessageText };
      // API: POST /inquiries/:id/replies
      const res = await api.post(`/inquiries/${selected.id}/replies`, payload);
      const responseData = res?.data || res;

      const replyData = responseData?.data?.reply || responseData?.reply;

      // Construct new message
      const newMsg = {
        id: replyData?.id || Date.now(),
        from: "partner",
        text: replyData?.message || currentMessageText,
        timestamp: new Date(replyData?.createdAt || Date.now()).toLocaleString(),
      };

      // Append new message to the existing list
      setSelected((prev) => ({
        ...prev,
        inquiries: [...prev.inquiries, newMsg],
      }));

      setReplyText("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    } catch (err) {
      console.error("Reply error:", err);
      showToast({ type: "error", message: "Failed to send reply." });
    } finally {
      setIsSending(false);
    }
  };

  const handleRefresh = () => {
    if (selected?.id) {
      fetchThreadDetails(selected.id);
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)] relative">
      {/* Left: Inquiry Threads Card */}
      <div className={`${isOpen ? 'hidden' : 'block'} lg:block w-96 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Inquiry Threads
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {loading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
             </div>
          ) : filtered.length === 0 ? (
             <div className="p-4 text-center text-gray-500 text-sm">No inquiries found.</div>
          ) : (
            filtered.map((thread) => (
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
                        })}
                    </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-0.5 truncate">
                    Property: {thread.propertyName}
                    </div>
                    <div className="text-xs text-gray-500 truncate mb-2">
                    {thread.lastMessage}
                    </div>
                    {getStatusBadge(thread.status)}
                </div>
                </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Chat/Detail Card */}
      <div className={`${isOpen ? 'block' : 'hidden'} flex-1 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
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
                    
                    {/* Header Actions: Refresh & Close */}
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
                        onClick={() => { setSelected(null); setIsOpen(false); }}
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-24 relative">
              {loadingConversation ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
              ) : (
                <div className="w-full">
                    {selected.inquiries.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">No messages in this conversation yet.</div>
                    )}
                    
                    {selected.inquiries.map((msg) => (
                        <div key={msg.id} className="mb-4">
                            {msg.from === "partner" ? (
                                /* Partner Message (Right - Me) */
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="text-right">
                                        <div className="bg-[#3B82F6] text-white rounded-lg px-4 py-2.5 text-sm inline-block max-w-2xl text-left">
                                            {msg.text}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1.5">
                                            You, {msg.timestamp}
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                                        P
                                    </div>
                                </div>
                            ) : (
                                /* Client or Admin Message (Left - Them) */
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${msg.from === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-300 text-gray-700'}`}>
                                        {msg.from === 'admin' ? 'A' : (selected.userName ? selected.userName[0] : 'U')}
                                    </div>
                                    <div>
                                        <div className={`rounded-lg px-4 py-2.5 text-sm inline-block max-w-2xl ${msg.from === 'admin' ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-gray-100 text-gray-900'}`}>
                                            {msg.text}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1.5">
                                            {msg.senderName || (msg.from === 'admin' ? 'Admin' : selected.userName)}, {msg.timestamp}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center gap-2">
                <input
                  value={replyText}
                  disabled={isSending}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && sendReply()}
                  placeholder="Type your message"
                  className="flex-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={sendReply}
                    disabled={isSending || !replyText.trim()}
                    className="bg-[#e6b325] text-white px-5 py-2.5 rounded-md text-xs lg:text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                    Send
                  </button>
                </div>
              </div>
              <div className="sm:text-xs text-[9px] text-gray-400 mt-0.5 sm:mt-2 text-left sm:text-right">
                Respond to potential buyers.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}