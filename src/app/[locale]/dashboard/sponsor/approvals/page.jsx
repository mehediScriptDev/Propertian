"use client";

import { useState, useMemo, useEffect } from "react";
import axios from '@/lib/axios';
import Link from "next/link";
import { Eye, Edit, Trash2, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import StatsCard from "@/components/dashboard/admin/StatsCard";

export default function SponsorApprovalsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const badgeClass = (status) => {
    const s = (status || '').toString();
    switch (s) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusDotClass = (status) => {
    const s = (status || '').toString();
    switch (s) {
      case 'Approved': return 'bg-green-600';
      case 'Pending': return 'bg-red-600';
      case 'Rejected': return 'bg-gray-600';
      case 'Under Review': return 'bg-blue-600';
      default: return 'bg-gray-400';
    }
  };

  const normalizeStatus = (raw) => {
    if (!raw && raw !== 0) return 'Pending';
    const s = raw.toString().trim().toLowerCase();
    if (s === 'approved' || s === 'approve') return 'Approved';
    if (s === 'rejected') return 'Rejected';
    if (s === 'pending') return 'Pending';
    if (s === 'under review' || s === 'under_review' || s === 'under-review') return 'Under Review';
    // fallback: capitalize first letter
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const typeBadgeClass = (type) => {
    const t = (type || '').toString().toLowerCase();
    switch (t) {
      case 'seminar': return 'bg-indigo-100 text-indigo-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      case 'webinar': return 'bg-blue-100 text-blue-800';
      case 'conference': return 'bg-purple-100 text-purple-800';
      case 'open_house':
      case 'open-house':
      case 'open house': return 'bg-yellow-100 text-yellow-800';
      case 'showcase': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/events/my-events', { params: { page: 1, limit: 50 } });
        const raw = res?.data;
        let items = [];
        if (Array.isArray(raw)) items = raw;
        else if (Array.isArray(raw?.data)) items = raw.data;
        else if (Array.isArray(raw?.data?.items)) items = raw.data.items;
        else if (Array.isArray(raw?.items)) items = raw.items;
        else items = [];

        const mapped = items.map((ev) => ({
          id: ev?.id || ev?._id,
          title: ev?.title || ev?.name || 'Untitled',
          requester: ev?.createdByName || ev?.createdBy || (ev.sponsor && ev.sponsor.name) || '—',
          type: (ev?.eventType || ev?.type || '').toString().toLowerCase(),
          status: normalizeStatus(ev?.approvalStatus || ev?.status || 'Pending'),
          startDate: (ev?.eventDate || ev?.startDateTime || ev?.createdAt) ? new Date(ev.eventDate || ev.startDateTime || ev.createdAt).toLocaleDateString() : '-',
          endDate: (ev?.endDate || ev?.endDateTime) ? new Date(ev.endDate || ev.endDateTime).toLocaleDateString() : '-',
          image: ev?.image || (Array.isArray(ev?.images) && ev.images[0]) || ev?.imageUrl || null,
        }));

        if (mounted) setRows(mapped);
      } catch (err) {
        console.error('Failed to fetch approvals events', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = rows.filter(r => normalizeStatus(r.status) === 'Pending').length;
    const approved = rows.filter(r => normalizeStatus(r.status) === 'Approved').length;
    const rejected = rows.filter(r => normalizeStatus(r.status) === 'Rejected').length;
    const underReview = rows.filter(r => normalizeStatus(r.status) === 'Under Review').length;
    return { pending, approved, rejected, underReview };
  }, [rows]);

  // Filter rows based on search and status
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        searchQuery === "" ||
        row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || normalizeStatus(row.status) === normalizeStatus(filterStatus);
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pending" value={stats.pending} icon={Clock} />
        <StatsCard title="Approved" value={stats.approved} icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        <StatsCard title="Under Review" value={stats.underReview} icon={AlertCircle} />
      </div> */}

      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Approvals</h1>
              <p className="mt-1 text-sm text-gray-600">Track the approval status of your event submissions</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                  aria-label="Search events"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto cursor-pointer"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-sm font-medium text-gray-700">Loading events...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Campaign</th>
                    <th className="px-6 py-3 text-left">Requester</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Start Date</th>
                    <th className="px-6 py-3 text-left">End Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="truncate">{r.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.requester}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClass(r.type)} capitalize`}>{r.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{r.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{r.endDate}</td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDotClass(r.status)}`} />
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button aria-label={`View ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button aria-label={`Edit ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button aria-label={`Delete ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list (matches overview mobile card style) */}
            <div className="divide-y divide-gray-200 lg:hidden">
              {filteredRows.map((r) => (
                <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 flex gap-3">
                      {r.image ? (
                        <img src={r.image} alt={r.title} className="h-14 w-20 object-cover rounded" />
                      ) : (
                        <div className="h-14 w-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate">{r.title}</div>
                        <div className="mt-1 text-sm text-gray-500 truncate">{r.requester}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeClass(r.type)} capitalize`}>{r.type}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="mr-3">Start: <span className="text-gray-700">{r.startDate}</span></span>
                          <span>End: <span className="text-gray-700">{r.endDate}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDotClass(r.status)}`} />
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button aria-label={`View ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </button>

                    <button aria-label={`Edit ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </button>

                    <button aria-label={`Delete ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {!loading && filteredRows.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
