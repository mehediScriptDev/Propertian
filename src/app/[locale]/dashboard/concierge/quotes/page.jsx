'use client';

import { use, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import Pagination from '@/components/dashboard/Pagination';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign,
} from 'lucide-react';
import ViewQuoteModal from '@/components/concierge/ViewQuoteModal';
import QuoteComposer from '@/components/concierge/QuoteComposer';

export default function ConciergeQuotesPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock quotes data
  const [quotes, setQuotes] = useState([
    {
      id: 'Q-001',
      requestId: 'SR-2398',
      clientName: 'David Thompson',
      serviceType: 'Utility Setup',
      items: [
        { description: 'Electricity setup and consultation', qty: 1, unit: 100 },
        { description: 'Internet installation', qty: 1, unit: 80 },
        { description: 'Gas connection service', qty: 1, unit: 70 },
      ],
      currency: 'USD',
      subtotal: 250,
      tax: 0,
      total: 250,
      status: 'accepted',
      submittedDate: '2026-01-10T09:00:00Z',
      expiryDate: '2026-01-20',
      notes: 'All utilities will be set up within 3 business days.',
      attachments: ['utility-checklist.pdf'],
    },
    {
      id: 'Q-002',
      requestId: 'SR-2399',
      clientName: 'Emma Watson',
      serviceType: 'Interior Design',
      items: [
        { description: 'Design consultation (2 hours)', qty: 2, unit: 150 },
        { description: 'Furniture sourcing', qty: 1, unit: 500 },
        { description: 'Color scheme development', qty: 1, unit: 200 },
        { description: 'Layout planning', qty: 1, unit: 150 },
      ],
      currency: 'USD',
      subtotal: 1200,
      tax: 0,
      total: 1200,
      status: 'pending',
      submittedDate: '2026-01-11T11:30:00Z',
      expiryDate: '2026-01-21',
      notes: 'Project timeline: 2-3 weeks. Includes 2 revision rounds.',
      attachments: ['portfolio.pdf', 'sample-designs.pdf'],
    },
    {
      id: 'Q-003',
      requestId: 'SR-2400',
      clientName: 'Robert Miller',
      serviceType: 'Cleaning Services',
      items: [
        { description: 'Deep cleaning (1500 sq ft)', qty: 1, unit: 300 },
        { description: 'Carpet steam cleaning', qty: 1, unit: 150 },
        { description: 'Window washing (interior/exterior)', qty: 1, unit: 100 },
      ],
      currency: 'USD',
      subtotal: 550,
      tax: 0,
      total: 550,
      status: 'rejected',
      submittedDate: '2026-01-09T14:00:00Z',
      expiryDate: '2026-01-19',
      notes: 'Eco-friendly cleaning products used. Service includes all supplies.',
      attachments: [],
      rejectionReason: 'Client chose another provider',
    },
    {
      id: 'Q-004',
      requestId: 'SR-2403',
      clientName: 'Michael Chen',
      serviceType: 'Cleaning Services',
      items: [
        { description: 'Deep cleaning service', qty: 1, unit: 400 },
        { description: 'Carpet cleaning', qty: 1, unit: 120 },
      ],
      currency: 'USD',
      subtotal: 520,
      tax: 0,
      total: 520,
      status: 'pending',
      submittedDate: '2026-01-11T10:30:00Z',
      expiryDate: '2026-01-18',
      notes: 'Can complete within 24 hours of approval.',
      attachments: [],
    },
  ]);

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    let filtered = [...quotes];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.id.toLowerCase().includes(query) ||
          q.clientName.toLowerCase().includes(query) ||
          q.serviceType.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
  }, [quotes, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuotes.slice(start, start + itemsPerPage);
  }, [filteredQuotes, currentPage]);

  // Stats
  const stats = useMemo(() => {
    const total = quotes.length;
    const pending = quotes.filter((q) => q.status === 'pending').length;
    const accepted = quotes.filter((q) => q.status === 'accepted').length;
    const rejected = quotes.filter((q) => q.status === 'rejected').length;
    const revenue = quotes
      .filter((q) => q.status === 'accepted')
      .reduce((sum, q) => sum + q.total, 0);

    return { total, pending, accepted, rejected, revenue };
  }, [quotes]);

  const handleView = (quote) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  const handleEdit = (quote) => {
    if (quote.status === 'pending') {
      setSelectedQuote(quote);
      setShowEditModal(true);
    }
  };

  const handleDelete = (quoteId) => {
    if (confirm('Are you sure you want to withdraw this quote?')) {
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-yellow-500', label: 'Pending', icon: Clock },
      accepted: { bg: 'bg-green-500', label: 'Accepted', icon: CheckCircle },
      rejected: { bg: 'bg-red-500', label: 'Rejected', icon: XCircle },
    };
    const s = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${s.bg}`}
      >
        <s.icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">My Quotes</h1>
        <p className="text-sm text-gray-700 mt-2">
          Track all your submitted quotes and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Quotes" value={stats.total} icon={FileText} />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} />
        <StatsCard title="Accepted" value={stats.accepted} icon={CheckCircle} />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        {/* <StatsCard title="Revenue (USD)" value={stats.revenue} icon={DollarSign} /> */}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search quotes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quote.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quote.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {quote.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {quote.currency} {quote.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(quote.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(quote)}
                        className="text-primary hover:text-primary/80"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleEdit(quote)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit quote"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(quote.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Withdraw quote"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedQuotes.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No quotes found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <ViewQuoteModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedQuote(null);
        }}
        quote={selectedQuote}
      />

      <QuoteComposer
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedQuote(null);
        }}
        onSend={(updatedQuote) => {
          setQuotes((prev) =>
            prev.map((q) => (q.id === selectedQuote?.id ? { ...q, ...updatedQuote } : q))
          );
          setShowEditModal(false);
          setSelectedQuote(null);
        }}
        ticket={selectedQuote}
      />
    </div>
  );
}
