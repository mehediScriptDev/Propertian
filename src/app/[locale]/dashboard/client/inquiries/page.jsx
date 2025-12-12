"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  Building2,
  MoreVertical,
  Eye,
  Send,
  Archive,
} from "lucide-react";
import InquiryModal from "@/components/dashboard/InquiryModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import api from "@/lib/api";

const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
  ssr: false,
});

export default function ClientInquiriesPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filterStatus && filterStatus !== "all") params.status = filterStatus;
      if (searchQuery) params.q = searchQuery;

      // Use the canonical endpoint for user inquiries
      try {
        const res = await api.get("/inquiries/my-inquiries", {
          params,
          signal: controller.signal,
        });
        const payload = res;

        const items =
          payload?.data?.inquiries ||
          payload?.inquiries ||
          payload?.data ||
          payload ||
          [];

        const mapped = (Array.isArray(items) ? items : []).map((iq) => ({
          id: iq.id || iq._id,
          name: iq.user?.name || iq.name || "",
          email: iq.user?.email || iq.email || "",
          phone: iq.user?.phone || iq.phone || "",
          property: iq.property
            ? iq.property.title || iq.property.address || iq.property
            : iq.propertyId || "",
          subject:
            iq.subject ||
            (iq.property?.title
              ? `Inquiry about ${iq.property.title}`
              : "Property inquiry"),
          message: iq.message || "",
          date: iq.createdAt || iq.date || new Date().toISOString(),
          status: (iq.status || "").toString().toLowerCase(),
          priority: (iq.priority || "medium").toString().toLowerCase(),
        }));

        if (!mounted) return;

        setInquiries(mapped);

        const pg = payload?.data?.pagination || payload?.pagination;
        if (pg) {
          setTotalItems(pg.totalItems || pg.total || mapped.length);
          setTotalPages(
            pg.totalPages ||
              Math.ceil((pg.totalItems || mapped.length) / itemsPerPage)
          );
        } else {
          setTotalItems(mapped.length);
          setTotalPages(Math.max(1, Math.ceil(mapped.length / itemsPerPage)));
        }

        setLoading(false);
      } catch (err) {
        // Better error messages for common cases
        if (err?.status === 403) {
          setError("Access denied. Insufficient permissions.");
        } else if (err?.status === 404) {
          setError("Resource not found: /inquiries/my-inquiries");
        } else {
          setError(err?.message || "Failed to load inquiries");
        }
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 250);

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [currentPage, filterStatus, searchQuery]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: "bg-blue-100", text: "text-blue-800", label: "New" },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      resolved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Resolved",
      },
      closed: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    };
    const cfg = statusConfig[status] || statusConfig.new;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const cfg = {
      high: { bg: "bg-red-100", text: "text-red-800", label: "High" },
      medium: { bg: "bg-orange-100", text: "text-orange-800", label: "Medium" },
      low: { bg: "bg-gray-100", text: "text-gray-800", label: "Low" },
    }[priority] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Medium",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const truncateWords = (text = '', count = 5) => {
    if (!text) return '';
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= count) return text;
    return words.slice(0, count).join(' ') + '...';
  };

  // We rely on server filtering/pagination. `inquiries` is already the current page items.
  const filtered = useMemo(() => inquiries, [inquiries]);
  const pageItems = filtered;

  return (
    <div className="space-y-3 lg:space-y-4.5">
      <div className="rounded-lg bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {t("inquiries") || "My Inquiries"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("AllInquiries") || "All your recent inquiries"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white/50 shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("AllInquiries") || "All Inquiries"}
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder={t("SearchInquiries") || "Search inquiries..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                  aria-label="Search inquiries"
                />
              </div>

              <div className="relative">
                <Filter
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto"
                  aria-label="Filter by status"
                >
                  <option value="all">
                    {t("AllInquiries") || "All Status"}
                  </option>
                  <option value="new">
                    {t("Developer_Inquiry.New") || "New"}
                  </option>
                  <option value="pending">
                    {t("Developer_Inquiry.Pending") || "Pending"}
                  </option>
                  <option value="resolved">
                    {t("Developer_Inquiry.Resolved") || "Resolved"}
                  </option>
                  <option value="closed">
                    {t("Developer_Inquiry.Closed") || "Closed"}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Property Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white/50">
              {pageItems.map((iq) => (
                <tr
                  key={iq.id}
                  className="transition-colors hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedInquiry(iq)}
                >
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {iq.property}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 truncate w-72 max-w-[18rem]">
                    <div
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setSelectedInquiry(iq); }}
                      title={iq.message}
                    >
                      {truncateWords(iq.message, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(iq.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getPriorityBadge(iq.priority)}</td>
                  <td className="px-6 py-4">{getStatusBadge(iq.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                        title="View inquiry"
                        aria-label="View inquiry"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(iq);
                        }}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      {/* <button className="rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E6B325]" title="Reply" aria-label="Reply to inquiry" onClick={(e)=>e.stopPropagation()}>
                        <Send className="h-4 w-4 text-[#E6B325]" />
                      </button>
                      <button className="rounded p-1.5 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500" title="Archive" aria-label="Archive inquiry" onClick={(e)=>e.stopPropagation()}>
                        <Archive className="h-4 w-4 text-gray-600" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-200 lg:hidden">
          {pageItems.map((iq) => (
            <div
              key={iq.id}
              className="p-4 transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedInquiry(iq)}
            >
              {console.log(iq)}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {iq.message}
                  </p>
                  <p className="text-xs text-gray-500">{iq.property}</p>
                </div>
                <button
                  className="rounded p-1.5 transition-colors hover:bg-gray-100"
                  aria-label="More options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  {new Date(iq.date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(iq.priority)}
                  {getStatusBadge(iq.status)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded p-1.5 transition-colors hover:bg-gray-100"
                    title="View"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  {/* <button className="rounded p-1.5 transition-colors hover:bg-gray-100" title="Reply" onClick={(e)=>e.stopPropagation()}><Send className="h-4 w-4 text-[#E6B325]" /></button>
                    <button className="rounded p-1.5 transition-colors hover:bg-gray-100" title="Archive" onClick={(e)=>e.stopPropagation()}><Archive className="h-4 w-4 text-gray-600" /></button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#E6B325]"></div>
            <p className="mt-1 text-sm text-gray-500">Loading inquiries…</p>
          </div>
        ) : (
          filtered.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">
                {t("Developer_Inquiry.NoInquiriesFound") ||
                  "No inquiries found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("Developer_Inquiry.TryAdjusting") ||
                  "Try adjusting your search or filters."}
              </p>
            </div>
          )
        )}

        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            translations={{
              showing: t("common.showing"),
              to: t("common.to"),
              of: "out of",
              results: t("common.results"),
              previous: t("common.previous"),
              next: t("common.next"),
            }}
          />
        )}
      </div>

      <InquiryModal isOpen={!!selectedInquiry} onClose={() => setSelectedInquiry(null)} inquiry={selectedInquiry} />
    </div>
  );
}
