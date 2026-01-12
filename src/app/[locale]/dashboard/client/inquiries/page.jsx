"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import api from "@/lib/api";
import { showToast } from "@/components/Toast";

export default function ClientInquiriesPage() {
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

  // Mock inquiry threads (replace with API call later)
  const propertyThreads = useMemo(
    () => [
      {
        id: 1,
        propertyName: "2BR Apartment in Manhattan",
        location: "Upper East Side",
        city: "New York",
        status: "new",
        image: "/buy-rent/hero.jpg",
        lastMessage:
          "Hi, I'm interested in viewing this property. Is it still available?",
        partnerName: "Smith Realty",
        partnerAvatar: null,
        timestamp: "Jan 11, 2026, 10:49 AM",
        inquiries: [
          {
            id: 1,
            from: "user",
            text: "Hi, I'm interested in viewing this property. Is it still available?",
            timestamp: "10:49 AM",
          },
        ],
      },
      {
        id: 2,
        propertyName: "3BR House in Brooklyn",
        location: "Park Slope",
        city: "Brooklyn",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: Yes, we have availability...",
        partnerName: "Brooklyn Homes",
        partnerAvatar: null,
        timestamp: "Jan 10, 2026, 2:30 PM",
        inquiries: [
          {
            id: 1,
            from: "user",
            text: "What's the monthly rent?",
            timestamp: "2:30 PM",
          },
          {
            id: 2,
            from: "partner",
            text: "The monthly rent is $3,500. Would you like to schedule a viewing?",
            timestamp: "3:15 PM",
          },
        ],
      },
      {
        id: 3,
        propertyName: "Studio in Queens",
        location: "Astoria",
        city: "Queens",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: The utilities are included...",
        partnerName: "Queens Living",
        partnerAvatar: null,
        timestamp: "Jan 9, 2026, 11:20 AM",
        inquiries: [
          {
            id: 1,
            from: "user",
            text: "Are utilities included in the rent?",
            timestamp: "11:20 AM",
          },
        ],
      },
      {
        id: 4,
        propertyName: "4BR Townhouse in Staten Island",
        location: "St. George",
        city: "Staten Island",
        status: "closed",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: Thank you for your interest...",
        partnerName: "Island Properties",
        partnerAvatar: null,
        timestamp: "Jan 5, 2026, 9:15 AM",
        inquiries: [],
      },
      {
        id: 5,
        propertyName: "1BR Condo in Jersey City",
        location: "Downtown",
        city: "Jersey City",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: We can arrange a visit...",
        partnerName: "Hudson Realty",
        partnerAvatar: null,
        timestamp: "Jan 8, 2026, 4:45 PM",
        inquiries: [],
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return propertyThreads.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.propertyName.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.partnerName.toLowerCase().includes(q)
      );
    });
  }, [propertyThreads, search, statusFilter]);

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
    setIsOpen(true);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "user",
      text: replyText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSelected({ ...selected, inquiries: [...selected.inquiries, newMsg] });
    setReplyText("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)] relative">
      {/* Left: Inquiry Threads Card */}
      <div className={`${isOpen ? 'hidden' : 'block'} lg:block w-96 rounded-lg overflow-y-scroll bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            My Inquiry Threads
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filtered.map((thread) => (
            <button
              key={thread.id}
              onClick={() => selectThread(thread)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                selected?.id === thread.id ? "bg-gray-50" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                {thread.partnerName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {thread.partnerName}
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
                  Property: {thread.propertyName}
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

      {/* Right: Chat/Detail Card */}
      <div className={`${isOpen ? 'block' : 'hidden'} flex-1 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
        {!selected ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a thread to view conversation
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
                      <div className="sm:text-xs text-[10px] text-gray-400 mt-1">
                        Partner: {selected.partnerName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
            <div className="flex-1 overflow-y-auto p-6 pb-24">
              <div className="w-full">
                {/* My Inquiries Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    My Inquiries
                  </h4>
                  {selected.inquiries
                    .filter((m) => m.from === "user")
                    .map((msg) => (
                      <div key={msg.id} className="mb-4">
                        <div className="flex items-start gap-3 justify-end">
                          <div className="text-right">
                            <div className="bg-[#3B82F6] text-white rounded-lg px-4 py-2.5 text-sm inline-block max-w-2xl">
                              {msg.text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1.5">
                              You, {msg.timestamp}
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                            U
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Partner Responses Section */}
                {selected.inquiries.filter((m) => m.from === "partner").length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Partner Responses
                    </h4>
                    {selected.inquiries
                      .filter((m) => m.from === "partner")
                      .map((msg) => (
                        <div key={msg.id} className="mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold shrink-0">
                              {selected.partnerName[0]}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-900 max-w-2xl">
                                {msg.text}
                              </div>
                              <div className="text-xs text-gray-500 mt-1.5">
                                {selected.partnerName}, {msg.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Reply Input (sticky to bottom) */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendReply()}
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
                </div>
              </div>
              <div className="sm:text-xs text-[9px] text-gray-400 mt-0.5 sm:mt-2 text-left sm:text-right">
                Responses from property partners will appear here.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

