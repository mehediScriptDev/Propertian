
"use client";

import { useState, useMemo, useCallback, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { Building2, Search, Filter, Plus, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { get, post } from "@/lib/api";

// Aggressively lazy load non-critical components
const StatsCard = dynamic(
  () => import("@/components/dashboard/admin/StatsCard"),
  {
    loading: () => (
      <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
    ),
    ssr: false, // Don't render on server for faster initial load
  },
);

const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
  ssr: false, // Load after initial render
});

// Lazy load status badge icons
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
  { ssr: false },
);
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false },
);
const XCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.XCircle })),
  { ssr: false },
);


export default function DeveloperPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyIdInput, setPropertyIdInput] = useState("");
  const [documents, setDocuments] = useState([{ type: 'OWNERSHIP_PROOF', url: '' }]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Fetch verifications data from API
  useEffect(() => {
    let isMounted = true;

    async function fetchVerifications() {
      setLoading(true);
      setError(null);
      try {
        const response = await get(
          `/verifications/my-verifications?page=${currentPage}&limit=${itemsPerPage}`,
        );

        console.log("API Response:", response);

        if (isMounted && response?.data) {
          setVerifications(response.data);
          console.log("Verifications set:", response.data);
        }
      } catch (err) {
        console.error("Failed to load verifications", err);
        if (isMounted) {
          setError(err?.message || "Failed to load verifications");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVerifications();

    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage]);

  // Simplified status badge without icons for better performance
  const getStatusBadge = useCallback((status) => {
    const statusStyles = {
      APPROVED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      REJECTED: "bg-red-100 text-red-800",
      UNDER_REVIEW: "bg-blue-100 text-blue-800",
    };

    const labels = {
      APPROVED: "Approved",
      PENDING: "Pending",
      REJECTED: "Rejected",
      UNDER_REVIEW: "Under Review",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.PENDING
        }`}
      >
        {labels[status] || labels.PENDING}
      </span>
    );
  }, []);

  // Memoize filtered verifications for better performance
  const filteredVerifications = useMemo(() => {
    return verifications.filter((verification) => {
      const property = verification.property;
      const matchesSearch =
        searchQuery === "" ||
        property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || verification.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [verifications, searchQuery, filterStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerifications = filteredVerifications.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3 lg:space-y-4.5">
      {/* Page Header */}
      <div className="rounded-lg bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Verification overview
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your property verification requests.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none"
            aria-label="Add new property"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit new property
          </button>
        </div>
      </div>
      {/* Submit new property modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="sticky top-0 flex items-center justify-between gap-4 border-b p-4">
              <h3 className="text-lg font-semibold">Submit property for verification</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600">✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setSubmitError(null);
                setSubmitSuccess(null);
                try {
                  if (!propertyIdInput) throw new Error('Property ID is required');
                  const payload = {
                    documents: documents.filter(d => d.url).map(d => ({ type: d.type, url: d.url })),
                    additionalInfo: additionalInfo || undefined,
                  };
                  const res = await post(`/verifications/properties/${propertyIdInput}/request-verification`, payload);
                  setSubmitSuccess('Verification request submitted');
                  // Optionally refresh verifications list after submission
                } catch (err) {
                  console.error('Request failed', err);
                  setSubmitError(err?.message || 'Failed to submit verification request');
                } finally {
                  setSubmitting(false);
                }
              }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Property ID</label>
                <input required value={propertyIdInput} onChange={(e) => setPropertyIdInput(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium">Documents (URLs)</label>
                <div className="space-y-2 mt-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select value={doc.type} onChange={(e) => {
                        const copy = [...documents]; copy[idx].type = e.target.value; setDocuments(copy);
                      }} className="rounded border px-2 py-1 text-sm">
                        <option value="OWNERSHIP_PROOF">OWNERSHIP_PROOF</option>
                        <option value="ID_PROOF">ID_PROOF</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                      <input placeholder="https://storage.example.com/doc.pdf" value={doc.url} onChange={(e) => {
                        const copy = [...documents]; copy[idx].url = e.target.value; setDocuments(copy);
                      }} className="flex-1 rounded border px-3 py-1 text-sm" />
                      <button type="button" onClick={() => setDocuments(d => d.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button type="button" onClick={() => setDocuments(d => [...d, { type: 'OWNERSHIP_PROOF', url: '' }])} className="text-sm text-[#E6B325]">+ Add document</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Additional Info</label>
                <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={3} />
              </div>

              {submitError && <div className="text-sm text-red-600">{submitError}</div>}
              {submitSuccess && <div className="text-sm text-green-700">{submitSuccess}</div>}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-[#E6B325] text-white">{submitting ? 'Submitting...' : 'Submit request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-lg bg-white/50 p-12 text-center shadow-sm border border-gray-200">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#E6B325]"></div>
          <p className="mt-4 text-sm text-gray-600">Loading verifications...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      {!loading && !error && (
        <div className="rounded-lg bg-white/50 shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Requests
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                    aria-label="Search properties"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
              
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
                {currentVerifications.map((verification) => (
                  <tr
                    key={verification.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {verification.property?.title || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verification.property?.address || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {verification.property?.city},{" "}
                      {verification.property?.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {verification.property?.propertyType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                      $
                      {verification.property?.price
                        ? Number(verification.property.price).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(verification.status)}
                    </td>
                  
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                          aria-label="View details"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards - Optimized */}
          <div className="divide-y divide-gray-200 lg:hidden">
            {currentVerifications.map((verification) => (
              <div key={verification.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {verification.property?.title || "N/A"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {verification.property?.city},{" "}
                      {verification.property?.state}
                    </p>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {verification.property?.propertyType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      $
                      {verification.property?.price
                        ? Number(verification.property.price).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Reviewer:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {verification.reviewer
                        ? `${verification.reviewer.firstName} ${verification.reviewer.lastName}`
                        : "Not reviewed"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {getStatusBadge(verification.status)}
                  <button
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="View details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVerifications.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">
                No verifications found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't submitted any verification requests yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredVerifications.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredVerifications.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              translations={{
                showing: "Showing",
                to: t("common.to"),
                of: t("common.of"),
                results: t("common.results"),
                previous: t("common.previous"),
                next: t("common.next"),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
