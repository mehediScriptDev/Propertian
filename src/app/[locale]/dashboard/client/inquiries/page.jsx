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
  Trash,
} from "lucide-react";
import InquiryModal from "@/components/dashboard/InquiryModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import api from "@/lib/api";
import axios from "@/lib/axios";
import { showToast } from "@/components/Toast";

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
  
  // Confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, inquiryId: null });

  // Open delete confirmation modal
  const handleDeleteClick = (e, inquiryId) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDeleteConfirm({ open: true, inquiryId });
  };

  // Confirm and delete inquiry
  const confirmDelete = async () => {
    const inquiryId = deleteConfirm.inquiryId;
    setDeleteConfirm({ open: false, inquiryId: null });
    
    try {
      await api.delete(`/inquiries/${inquiryId}`);
      setInquiries((prev) =>
        prev.filter((iq) => (iq.id || iq._id) !== inquiryId)
      );
      showToast("Inquiry deleted successfully", "success");
    } catch (err) {
      console.error("Inquiry delete failed", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete inquiry";
      showToast(msg, "error");
    }
  };

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

  // Apply client-side filtering so UI responds even if backend doesn't honor params
  const filtered = useMemo(() => {
    const q = (searchQuery || '').toString().trim().toLowerCase();
    return (inquiries || []).filter((iq) => {
      if (filterStatus && filterStatus !== 'all') {
        if ((iq.status || '').toString().toLowerCase() !== filterStatus.toString().toLowerCase()) {
          return false;
        }
      }

      if (q) {
        const hay = [
          iq.name,
          iq.email,
          iq.phone,
          iq.property,
          iq.subject,
          iq.message,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [inquiries, filterStatus, searchQuery]);

  // Client-side pagination for the filtered results (inquiries already may be paginated by server)
  const totalFilteredItems = filtered.length;
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <tr key={iq.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 truncate">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {iq.property}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 truncate w-72 max-w-[18rem]">
                    <div className="text-sm font-medium text-gray-900" title={iq.message}>
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
                  <td className="px-6 py-4 actions-col">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openInquiry(iq)}
                        aria-label="View"
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        title="View"
                      >
                        <Eye className="w-5 h-5 text-gray-600" aria-hidden="true" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, iq.id ?? iq._id)}
                        aria-label="Delete inquiry"
                        className="ml-3 p-1 rounded hover:bg-red-50 focus:outline-none"
                        title="Delete"
                      >
                        <Trash className="w-5 h-5 text-red-600" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-200 lg:hidden">
          {pageItems.map((iq) => (
            <div key={iq.id} className="p-4 transition-colors hover:bg-gray-50">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInquiry(iq);
                    }}
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="rounded transition-colors"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(e, iq.id ?? iq._id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({ open: false, inquiryId: null })}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" style={{ backgroundColor: '#f8f3d5' }}>
                <Trash className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete Inquiry?
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this inquiry? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ open: false, inquiryId: null })}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
