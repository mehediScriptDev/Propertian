"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Filter, Eye, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { get } from "@/lib/api";

const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
  ssr: false,
});

export default function PartnerInquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 5;
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPagesState, setTotalPagesState] = useState(1);
  const [totalItemsState, setTotalItemsState] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchInquiries() {
      setLoading(true);
      try {
        const res = await get("/inquiries/my-inquiries", {
          params: { page: currentPage, perPage: itemsPerPage },
        });

        // API shape: { success, data: { inquiries: [...], pagination: { currentPage, totalPages, totalItems } } }
        const apiInquiries = res?.data?.inquiries || [];
        const pagination = res?.data?.pagination || {};

        // Map API response fields to the shape used by the UI
        const mapped = apiInquiries.map((iq) => ({
          id: iq.id,
          message: iq.message || "",
          // keep subject separate; API may or may not provide it
          subject: iq.subject || "",
          status: (iq.status || "").toLowerCase(),
          created_at: iq.createdAt || iq.created_at,
          updated_at: iq.updatedAt || iq.updated_at,
          user_id: iq.userId || iq.user_id,
          property_id: iq.propertyId || iq.property_id,
          property: iq.properties || iq.property || null,
          response: iq.response || null,
          responded_by: iq.respondedBy || iq.responded_by || null,
          responded_at: iq.respondedAt || iq.responded_at || null,
        }));

        if (isMounted) {
          setInquiries(mapped);
          setTotalPagesState(pagination.totalPages || 1);
          setTotalItemsState(pagination.totalItems || mapped.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
        if (isMounted) setInquiries([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchInquiries();
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage]);

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    const q = (searchQuery || "").toString().toLowerCase();
    return inquiries.filter((inquiry) => {
      const matchesSearch =
        (inquiry.property?.title || "").toString().toLowerCase().includes(q) ||
        (inquiry.property?.address || "").toString().toLowerCase().includes(q) ||
        (inquiry.message || "").toString().toLowerCase().includes(q) ||
        (inquiry.user_id || "").toString().toLowerCase().includes(q) ||
        (inquiry.subject || "").toString().toLowerCase().includes(q);

      const matchesFilter = filterStatus === "all" || inquiry.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [inquiries, searchQuery, filterStatus]);

  // Pagination: we rely on server pagination. `inquiries` already holds current page.
  const totalPages = totalPagesState || Math.ceil((filteredInquiries.length || inquiries.length) / itemsPerPage);
  const currentInquiries = inquiries;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      responded: "bg-green-100 text-green-800",
    };
    return statusConfig[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-3 lg:space-y-4.5">
      <div className="rounded-lg bg-white/50 border border-gray-200 p-8 shadow-sm">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">{t("InquiryDetails.title")}</h2>
        <p className="text-gray-600">
          {t("InquiryDetails.subtitle")}
        </p>
      </div>

      <div className="rounded-lg bg-white/50 border border-gray-200 p-6 shadow-sm">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("InquiryDetails.SearchByName")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]/20"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              onFocus={() => setIsFilterOpen(true)}
              onBlur={() => setIsFilterOpen(false)}
              className="appearance-none w-full sm:w-auto rounded-md border border-gray-300 bg-white/50 pl-9 pr-10 py-2 text-sm text-gray-700 font-medium hover:border-gray-400 focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]/20 cursor-pointer transition-colors"
            >
              <option value="all">{t("InquiryDetails.AllStatus")}</option>
              <option value="pending">{t("InquiryDetails.Pending")}</option>
              <option value="in-progress">{t("InquiryDetails.InProgress")}</option>
              <option value="responded">{t("InquiryDetails.Responded")}</option>
            </select>
            <svg
              className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-200 z-10 ${
                isFilterOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.ID")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.PropertyInfo")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.Subject")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.Status")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.Date")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  {t("InquiryDetails.Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">#{inquiry.id}</td>

                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{inquiry.property?.title || "—"}</div>
                      <div className="text-gray-500">{inquiry.property?.address || ""}</div>
                      {inquiry.property?.city && <div className="text-gray-500">{inquiry.property.city}</div>}
                    </div>
                  </td>

                  {/* Type column: message snippet */}

                  {/* Subject column: show subject if provided */}
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{inquiry.subject || "—"}</td>

                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(inquiry.status)}`}>{inquiry.status}</span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-500">{formatDate(inquiry.created_at)}</td>

                  <td className="px-4 py-4">
                    <button onClick={() => setSelectedInquiry(inquiry)} className="inline-flex items-center gap-1 text-[#E6B325] hover:text-[#d4a520]">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">{t("InquiryDetails.ViewDetails") || "View"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentInquiries.map((inquiry) => (
            <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 break-words whitespace-normal truncate">{inquiry.property?.title || `Inquiry #${inquiry.id}`}</div>
                  <div className="text-sm text-gray-500 break-words whitespace-normal truncate">{inquiry.property?.address || ""}</div>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(inquiry.status)}`}>{inquiry.status}</span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="text-gray-600 font-medium break-words whitespace-pre-wrap">{inquiry.subject}</div>
                <div className="text-gray-600 break-words whitespace-pre-wrap">{inquiry.message}</div>
              </div>

              <div className="text-xs text-gray-500">{formatDate(inquiry.created_at)}</div>

              <button onClick={() => setSelectedInquiry(inquiry)} className="w-full flex items-center justify-center gap-2 bg-[#E6B325] hover:bg-[#d4a520] text-black font-medium px-4 py-2 rounded-lg transition-colors">
                <Eye className="h-4 w-4" />
                {t("InquiryDetails.ViewDetails")}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("InquiryDetails.NoInquiries")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("InquiryDetails.TryAdjusting")}
            </p>
          </div>
        )}

        {/* Pagination */}
        {currentInquiries.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItemsState}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              translations={{
                showing: t("Partner.Showing"),
                to: t("Partner.to"),
                of: t("Partner.of"),
                results: t("Partner.results"),
                previous: t("Partner.Previous"),
                next: t("Partner.Next"),
              }}
            />
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Inquiry Details
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inquiry ID
                  </label>
                  <div className="text-gray-900">#{selectedInquiry.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(
                      selectedInquiry.status
                    )}`}
                  >
                    {selectedInquiry.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <div className="text-gray-900">{selectedInquiry.subject}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <div className="text-gray-900">
                    {formatDate(selectedInquiry.created_at)}
                  </div>
                </div>
              </div>

              {/* Contact Information (minimal from API) */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <div className="text-gray-900">{selectedInquiry.user_id}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                    <div className="text-gray-900">{selectedInquiry.property?.title || selectedInquiry.property_id}</div>
                    {selectedInquiry.property?.price && (
                      <div className="text-gray-700">{selectedInquiry.property.price} XOF</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInquiry.property_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property ID
                      </label>
                      <div className="text-gray-900">
                        {selectedInquiry.property_id}
                      </div>
                    </div>
                  )}
                  {selectedInquiry.property_development_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Development ID
                      </label>
                      <div className="text-gray-900">
                        {selectedInquiry.property_development_id}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Inquiry Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <div className="text-gray-900">
                      {selectedInquiry.subject}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <div className="text-gray-900 bg-gray-50 rounded-lg p-4">
                      {selectedInquiry.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Information */}
              {selectedInquiry.response && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Response
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response Message
                      </label>
                      <div className="text-gray-900 bg-green-50 rounded-lg p-4">
                        {selectedInquiry.response}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responded By
                        </label>
                        <div className="text-gray-900">
                          {selectedInquiry.responded_by}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responded At
                        </label>
                        <div className="text-gray-900">
                          {formatDate(selectedInquiry.responded_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
              >
                Close
              </button>
              {selectedInquiry.status === "pending" && (
                <button className="px-6 py-2 bg-[#E6B325] hover:bg-[#d4a520] text-black font-semibold rounded-lg transition-colors">
                  Respond
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
