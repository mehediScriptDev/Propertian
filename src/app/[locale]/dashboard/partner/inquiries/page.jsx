"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Spinner } from "@/components/Loading";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { get } from "@/lib/api";
import api from "@/lib/api";
import { showToast } from "@/components/Toast";

export default function PartnerInquiriesPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      setLoading(true);
      try {
        const res = await get("/inquiries/my-inquiries");
        const apiInquiries = res?.data?.inquiries || res?.data || [];
        const mapped = apiInquiries.map((iq) => ({
          id: iq.id,
          subject: iq.subject || iq.title || "",
          message: iq.message || iq.body || "",
          status: (iq.status || "").toLowerCase(),
          created_at: iq.createdAt || iq.created_at,
          user: iq.user || null,
          property: iq.property || iq.properties || iq.property_title || iq.property_id || null,
          response: iq.response || iq.response_message || iq.responded || null,
          messages: iq.messages || null,
        }));
        if (mounted) setInquiries(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetch();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    // reset reply input when switching threads
    setReplyText("");
  }, [selected]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((iq) => {
      if (statusFilter !== "all" && iq.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (iq.property && String(iq.property).toLowerCase().includes(q)) ||
        (iq.subject && iq.subject.toLowerCase().includes(q)) ||
        (iq.message && iq.message.toLowerCase().includes(q))
      );
    });
  }, [inquiries, search, statusFilter]);

  const selectThread = (iq) => {
    setSelected(iq);
    // scroll to bottom after render
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const sendReply = async () => {
    if (!selected) return;
    if (!replyText.trim()) return;
    const payloads = [{ response: replyText }, { response_message: replyText }, { message: replyText }];
    let lastErr = null;
    for (const p of payloads) {
      try {
        await api.post(`/inquiries/${selected.id}/respond`, p);
        // optimistic update
        const updated = {
          ...selected,
          response: replyText,
          messages: [
            ...(selected.messages || []),
            { id: `local-${Date.now()}`, from: "partner", text: replyText, created_at: new Date().toISOString() },
          ],
        };
        setSelected(updated);
        setInquiries((prev) => prev.map((i) => (i.id === selected.id ? updated : i)));
        setReplyText("");
        showToast(t("Partner.ResponseSent") || "Response sent", "success");
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr) showToast(t("Partner.ResponseFailed") || "Failed to send response", "error");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="h-[74vh] rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex h-full">
        {/* Left threads list */}
        <aside className="w-80 min-w-[18rem] border-r border-gray-100 bg-white">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">{t("partnerInquiries.title") || "Inquiry Threads"}</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    placeholder={t("SearchInquiries") || "Search..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-[#E6B325]/20"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{t("partnerInquiries.subtitle") || "Client inquiries for your properties"}</div>
          </div>

          <div className="px-3 py-2 flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border rounded-md px-2 py-1">
              <option value="all">{t("AllInquiries") || "All"}</option>
              <option value="pending">{t("InquiryDetails.Pending") || "Pending"}</option>
              <option value="in-progress">{t("InquiryDetails.InProgress") || "In Progress"}</option>
              <option value="responded">{t("InquiryDetails.Responded") || "Responded"}</option>
            </select>
          </div>

          <div className="overflow-y-auto h-[calc(100%-120px)]">
            {loading ? (
              <div className="p-6 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              filtered.map((iq) => (
                <button
                  key={iq.id}
                  onClick={() => selectThread(iq)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b hover:bg-gray-50 transition-colors ${selected?.id === iq.id ? "bg-gray-50" : "bg-white"}`}>
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">{(iq.user && iq.user.name && iq.user.name[0]) || "U"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm text-gray-900 truncate">{iq.property?.title || iq.subject || `Inquiry #${iq.id}`}</div>
                      <div className="text-xs text-gray-500">{new Date(iq.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-gray-500 truncate mt-1">{(iq.message || "").slice(0, 80)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right chat area */}
        <main className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">{selected?.property?.title || selected?.subject || t("SelectThread") || "Select a thread"}</div>
              <div className="text-sm text-gray-500">{selected?.property?.address || selected?.user?.email || ""}</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-600 hover:text-gray-800">{t("Partner.Actions") || "Actions"}</button>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white" id="messages">
            {!selected ? (
              <div className="h-full flex items-center justify-center text-gray-400">{t("SelectThreadHint") || "Choose a thread to view messages"}</div>
            ) : (
              <div className="space-y-4">
                {(selected.messages && selected.messages.length > 0 ? selected.messages : [
                  { id: `msg-${selected.id}-user`, from: 'user', text: selected.message, created_at: selected.created_at },
                  ...(selected.response ? [{ id: `msg-${selected.id}-partner`, from: 'partner', text: selected.response, created_at: selected.responded_at || new Date().toISOString() }] : []),
                ]).map((m) => (
                  <div key={m.id} className={`max-w-[70%] ${m.from === 'partner' ? 'ml-auto text-right' : ''}`}>
                    <div className={`${m.from === 'partner' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-900'} inline-block px-4 py-2 rounded-lg`}>{m.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("TypeYourMessage") || "Type your message..."}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E6B325]/20"
              />
              <button onClick={sendReply} className="bg-[#E6B325] hover:bg-[#d4a520] text-black px-4 py-2 rounded-lg">{t("SendReply") || "Send Reply"}</button>
              <button onClick={() => setSelected(null)} className="text-sm text-gray-600 px-3 py-2">{t("CloseThread") || "Close"}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
