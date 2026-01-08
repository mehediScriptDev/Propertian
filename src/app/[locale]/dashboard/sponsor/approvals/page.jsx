"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import StatsCard from "@/components/dashboard/admin/StatsCard";

export default function SponsorApprovalsPage() {
  const [rows] = useState([
    { id: 1, title: 'Brand Awareness Q4', requester: 'Acme Inc', type: 'seminar', status: 'Pending', startDate: '2026-02-01', endDate: '2026-02-05' },
    { id: 2, title: 'Event Sponsorship - Gala', requester: 'BlueCo', type: 'showcase', status: 'Approved', startDate: '2026-03-10', endDate: '2026-03-10' },
    { id: 3, title: 'Referral Drive', requester: 'Acme Inc', type: 'workshop', status: 'Rejected', startDate: '2026-04-01', endDate: '2026-04-30' },
    { id: 4, title: 'Community Meetup', requester: 'LocalOrg', type: 'other', status: 'Under Review', startDate: '2026-05-15', endDate: '2026-05-15' },
    { id: 5, title: 'Tech Conference 2026', requester: 'TechCorp', type: 'seminar', status: 'Approved', startDate: '2026-06-20', endDate: '2026-06-22' },
    { id: 6, title: 'Product Launch Event', requester: 'StartupX', type: 'showcase', status: 'Pending', startDate: '2026-07-10', endDate: '2026-07-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const badgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const pending = rows.filter(r => r.status === 'Pending').length;
    const approved = rows.filter(r => r.status === 'Approved').length;
    const rejected = rows.filter(r => r.status === 'Rejected').length;
    const underReview = rows.filter(r => r.status === 'Under Review').length;
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
      const matchesStatus = filterStatus === "all" || row.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pending" value={stats.pending} icon={Clock} />
        <StatsCard title="Approved" value={stats.approved} icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        <StatsCard title="Under Review" value={stats.underReview} icon={AlertCircle} />
      </div>

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
                  <td className="px-6 py-4 font-medium text-gray-900">{r.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.requester}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 capitalize">{r.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.startDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{r.endDate}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span></td>
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
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{r.title}</div>
                  <div className="mt-1 text-sm text-gray-500 truncate">{r.requester}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 capitalize">{r.type}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="mr-3">Start: <span className="text-gray-700">{r.startDate}</span></span>
                    <span>End: <span className="text-gray-700">{r.endDate}</span></span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span>
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
        {filteredRows.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
