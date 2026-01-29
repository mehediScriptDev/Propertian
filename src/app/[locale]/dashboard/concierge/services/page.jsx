"use client";

import { use, useState } from "react";
import { useTranslation } from "@/i18n";
import Link from 'next/link';
import StatsCard from "@/components/dashboard/admin/StatsCard";
import {
  ArrowLeft,
  Search,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Plus,
  Download
} from "lucide-react";

export default function ConciergeServicesPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // Mock quotes data to match the design
  const [quotes] = useState([
    { id: 1, clientName: 'John Smith', clientEmail: 'john.smith@email.com', service: 'Property Viewing', amount: 3000, status: 'Pending', sentDate: '1/15/2024' },
    { id: 2, clientName: 'Maria Garcia', clientEmail: 'maria.garcia@email.com', service: 'Property Search', amount: 2000, status: 'Sent', sentDate: '1/14/2024' },
    { id: 3, clientName: 'David Chen', clientEmail: 'david.chen@email.com', service: 'Investment Consultation', amount: 1000, status: 'Accepted', sentDate: '1/14/2024' },
    { id: 4, clientName: 'Emma Thompson', clientEmail: 'emma.thompson@email.com', service: 'Relocation Services', amount: 1200, status: 'Accepted', sentDate: '1/17/2024' },
    { id: 5, clientName: 'Robert Davis', clientEmail: 'robert.davis@email.com', service: 'Property Viewing', amount: 1000, status: 'Accepted', sentDate: '1/12/2024' },
    { id: 6, clientName: 'Lisa Anderson', clientEmail: 'lisa.anderson@email.com', service: 'Market Analysis', amount: 500, status: 'Rejected', sentDate: '1/18/2024' }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    pending: quotes.filter(q => q.status === 'Pending').length,
    sent: quotes.filter(q => q.status === 'Sent').length,
    accepted: quotes.filter(q => q.status === 'Accepted').length,
    rejected: quotes.filter(q => q.status === 'Rejected').length,
  };

  const filtered = quotes.filter(q => {
    const matchesSearch = q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || q.service.toLowerCase().includes(searchQuery.toLowerCase()) || q.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (v) => `$${Number(v).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Quotes & Proposals</h1>
            <p className="text-sm text-gray-600">Manage and track all quotes sent to clients</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2 text-sm font-medium text-white">
              <Plus className="h-4 w-4" /> Assigned Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pending Approval" value={stats.pending} variant="warning" icon={FileText} />
        <StatsCard title="Sent to Client" value={stats.sent} variant="info" icon={Send} />
        <StatsCard title="Accepted" value={stats.accepted} variant="success" icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats.rejected} variant="danger" icon={XCircle} />
      </div>

      {/* Search + Filters */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tickets by client, service type, or location..." className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
              <option value="all">Status</option>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
              <option>Date Range</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QUOTE ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CLIENT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SERVICE REQUESTED</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AMOUNT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SENT DATE</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">#{q.id.toString().padStart(4,'0')}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{q.clientName}</div>
                    <div className="text-sm text-gray-500">{q.clientEmail}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{q.service}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(q.amount)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : q.status === 'Sent' ? 'bg-blue-100 text-blue-800' : q.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{q.sentDate}</td>
                  <td className="px-4 py-4 text-right">
                    <button className={q.status === 'Rejected' ? 'min-w-[120px] px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium' : 'min-w-[120px] px-4 py-2 bg-[#E6B325] text-white rounded-md text-sm font-medium'}>
                      {q.status === 'Pending' && 'View Quote'}
                      {q.status === 'Sent' && 'Send to Client'}
                      {q.status === 'Accepted' && 'View Quote'}
                      {q.status === 'Rejected' && 'Withdraw'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}