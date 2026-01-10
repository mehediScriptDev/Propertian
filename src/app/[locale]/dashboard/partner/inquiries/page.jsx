"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Image from "next/image";

export default function VerifiedPropertiesPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Mock property threads with inquiries
  const propertyThreads = useMemo(
    () => [
      {
        id: 1,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "new",
        image: "/buy-rent/hero.jpg",
        lastMessage:
          "Hi owner has like a noymoon ouyning sone. How raza is the side in the san and the nrectaire aw/or frrequal?",
        userName: "Mara Elham",
        userAvatar: null,
        timestamp: "Jan 7, 2026, 10:49 AM",
        inquiries: [
          {
            id: 1,
            from: "user",
            text: "Hi owner has like a noymoon ouyning sone. How raza is the side in the san and the nrectaire aw/or frrequal?",
            timestamp: "12:53 AM",
          },
        ],
      },
      {
        id: 2,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: You must alm at ex...",
        userName: "Mara Remant",
        userAvatar: null,
        timestamp: "Jan 6, 2026, 12:08 PM",
        inquiries: [
          {
            id: 1,
            from: "user",
            text: "Interested in viewing",
            timestamp: "12:08 PM",
          },
          {
            id: 2,
            from: "partner",
            text: "Sure, when would you like to visit?",
            timestamp: "12:31 PM",
          },
        ],
      },
      {
        id: 3,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: You must alm at ex...",
        userName: "Mara Simens",
        userAvatar: null,
        timestamp: "Jan 6, 2026, 12:08 PM",
        inquiries: [],
      },
      {
        id: 4,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "closed",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: You mashing your...",
        userName: "Mark Millonary",
        userAvatar: null,
        timestamp: "Jan 6, 2026, 10:23 PM",
        inquiries: [],
      },
      {
        id: 5,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "awaiting",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: Y must ullam at ex...",
        userName: "Karra Siham",
        userAvatar: null,
        timestamp: "Dec 4, 2025, 10:23 PM",
        inquiries: [],
      },
      {
        id: 6,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "closed",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: Y must ullam at ex...",
        userName: "Mica Sofonoir",
        userAvatar: null,
        timestamp: "Dec 6, 2025, 10:23 PM",
        inquiries: [],
      },
      {
        id: 7,
        propertyName: "2BR Apartment in Yopougon",
        location: "Yopougon Ananeraie",
        city: "Abidjan",
        status: "closed",
        image: "/buy-rent/hero.jpg",
        lastMessage: "Last message: Y must ullam at ex...",
        userName: "Karra Shms",
        userAvatar: null,
        timestamp: "Dec 24, 2025, 10:53 AM",
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
        t.userName.toLowerCase().includes(q)
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
    setIsOpen(true); // open chat on small/medium devices
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    // Optimistic update
    const newMsg = {
      id: Date.now(),
      from: "partner",
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
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left: Inquiry Threads Card */}
      <div className={`${isOpen ? 'hidden' : 'block'} lg:block w-96 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
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
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                selected?.id === thread.id ? "bg-gray-50" : ""
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
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block flex-1 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-24"> {/* reserve space for sticky input */}
              <div className="w-full">
                {/* User Inquiries Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    User Inquiries
                  </h4>
                  {selected.inquiries
                    .filter((m) => m.from === "user")
                    .map((msg) => (
                      <div key={msg.id} className="mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold shrink-0">
                            {selected.userName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-900 max-w-2xl">
                              {msg.text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1.5">
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* User Replies Section */}
                {selected.inquiries.filter((m) => m.from === "user").length >
                  0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      User Replies
                    </h4>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold shrink-0">
                        {selected.userName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">
                          Thenxas a mexoage.
                        </div>
                        <div className="text-xs text-gray-500 mt-1.5">
                          12:59 PM
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Partner Responds Section */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Partner Responds
                  </h4>
                  {selected.inquiries
                    .filter((m) => m.from === "partner")
                    .map((msg) => (
                      <div key={msg.id} className="mb-4">
                        <div className="flex items-start gap-3 justify-end">
                          <div className="text-right">
                            <div className="bg-[#3B82F6] text-white rounded-lg px-4 py-2.5 text-sm inline-block max-w-2xl">
                              {msg.text}
                            </div>
                            <div className="text-xs text-gray-500 mt-1.5">
                              Partner, {msg.timestamp}
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                            P
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="text-right">
                      <div className="bg-[#3B82F6] text-white rounded-lg px-4 py-2.5 text-sm inline-block max-w-2xl">
                        Hello world need to arminum ponerty coumarins that it a
                        exiing it. Adme ncnsive respondence that are not able to
                        recmmeriks.
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5">
                        Partner, 12:33 PM
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                      P
                    </div>
                  </div>
                </div>

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Reply Input (sticky to bottom) */}
            <div className="px-6 py-3 bg-white border-t border-gray-200 sticky bottom-0 z-10">
              <div className="flex items-center flex-col sm:flex-row gap-2">
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
