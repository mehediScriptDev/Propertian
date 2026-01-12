'use client';

import { use, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import Pagination from '@/components/dashboard/Pagination';
import {
  Bell,
  Clock,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';
import QuoteComposer from '@/components/concierge/QuoteComposer';

export default function ConciergeRequestsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data: Service requests assigned to partner by admin
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 'SR-2401',
      clientName: 'John Anderson',
      clientEmail: 'john.anderson@email.com',
      clientPhone: '+1 234 567 8900',
      serviceType: 'Airport Pickup',
      location: 'JFK Airport to Manhattan, NY',
      propertyAddress: '123 Main Street, Manhattan, NY 10001',
      status: 'pending-quote',
      priority: 'high',
      requestDate: '2026-01-12T08:30:00Z',
      dueDate: '2026-01-15T15:00:00Z',
      description: 'Need airport pickup service from JFK to Manhattan apartment. Flight arrives at 3:30 PM on Jan 15th. Client prefers luxury sedan.',
      budget: '$100-150',
      assignedBy: 'Admin',
      assignedDate: '2026-01-12T09:00:00Z',
    },
    {
      id: 'SR-2402',
      clientName: 'Sarah Miller',
      clientEmail: 'sarah.m@email.com',
      clientPhone: '+1 234 567 8901',
      serviceType: 'Property Maintenance',
      location: 'Brooklyn Heights, NY',
      propertyAddress: '456 Park Avenue, Brooklyn Heights, NY 11201',
      status: 'pending-quote',
      priority: 'medium',
      requestDate: '2026-01-11T10:00:00Z',
      dueDate: '2026-01-20T12:00:00Z',
      description: 'AC unit in master bedroom not cooling properly. Need professional inspection and repair. Tenant available weekdays after 5 PM.',
      budget: '$200-500',
      assignedBy: 'Admin',
      assignedDate: '2026-01-11T11:00:00Z',
    },
    {
      id: 'SR-2403',
      clientName: 'Michael Chen',
      clientEmail: 'mchen@email.com',
      clientPhone: '+1 234 567 8902',
      serviceType: 'Cleaning Services',
      location: 'Manhattan Upper East Side',
      propertyAddress: '789 Lexington Ave, Manhattan, NY 10021',
      status: 'quote-submitted',
      priority: 'low',
      requestDate: '2026-01-10T14:30:00Z',
      dueDate: '2026-01-18T09:00:00Z',
      description: 'Deep cleaning before move-in. 3BR apartment, approximately 1500 sq ft. Includes carpet cleaning and window washing.',
      budget: '$300-600',
      assignedBy: 'Admin',
      assignedDate: '2026-01-10T15:00:00Z',
      quoteSubmittedDate: '2026-01-11T10:30:00Z',
    },
    {
      id: 'SR-2404',
      clientName: 'Emma Thompson',
      clientEmail: 'emma.t@email.com',
      clientPhone: '+1 234 567 8903',
      serviceType: 'Document Translation',
      location: 'Queens, NY',
      propertyAddress: '321 Queens Blvd, Queens, NY 11375',
      status: 'pending-quote',
      priority: 'high',
      requestDate: '2026-01-09T16:00:00Z',
      dueDate: '2026-01-14T17:00:00Z',
      description: 'Lease agreement and building rules need to be translated from English to Mandarin Chinese. Total 12 pages.',
      budget: '$150-250',
      assignedBy: 'Admin',
      assignedDate: '2026-01-09T17:00:00Z',
    },
    {
      id: 'SR-2405',
      clientName: 'David Wilson',
      clientEmail: 'dwilson@email.com',
      clientPhone: '+1 234 567 8904',
      serviceType: 'Interior Design',
      location: 'SoHo, Manhattan',
      propertyAddress: '555 Broadway, Manhattan, NY 10012',
      status: 'quote-submitted',
      priority: 'medium',
      requestDate: '2026-01-08T11:00:00Z',
      dueDate: '2026-01-25T12:00:00Z',
      description: 'Consultation for 2BR loft apartment interior design. Modern minimalist style preferred. Need furniture recommendations and color scheme.',
      budget: '$1000-2000',
      assignedBy: 'Admin',
      assignedDate: '2026-01-08T13:00:00Z',
      quoteSubmittedDate: '2026-01-10T16:00:00Z',
    },
  ]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    let filtered = [...serviceRequests];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.clientName.toLowerCase().includes(query) ||
          r.serviceType.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((r) => r.priority === priorityFilter);
    }

    return filtered;
  }, [serviceRequests, searchTerm, statusFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Stats
  const stats = useMemo(() => {
    const total = serviceRequests.length;
    const pendingQuote = serviceRequests.filter((r) => r.status === 'pending-quote').length;
    const quoteSubmitted = serviceRequests.filter((r) => r.status === 'quote-submitted').length;
    const highPriority = serviceRequests.filter((r) => r.priority === 'high').length;

    return { total, pendingQuote, quoteSubmitted, highPriority };
  }, [serviceRequests]);

  const handleQuoteSubmit = (quote) => {
    // Update request status
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest?.id
          ? { ...r, status: 'quote-submitted', quoteSubmittedDate: new Date().toISOString() }
          : r
      )
    );
    setShowQuoteModal(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      'pending-quote': { bg: 'bg-yellow-500', label: 'Pending Quote' },
      'quote-submitted': { bg: 'bg-blue-500', label: 'Quote Submitted' },
      'quote-accepted': { bg: 'bg-green-500', label: 'Quote Accepted' },
      'in-progress': { bg: 'bg-purple-500', label: 'In Progress' },
      completed: { bg: 'bg-gray-500', label: 'Completed' },
    };
    const s = config[status] || config['pending-quote'];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${s.bg}`}
      >
        {s.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: { bg: 'bg-red-100 text-red-700', label: 'High', icon: AlertCircle },
      medium: { bg: 'bg-yellow-100 text-yellow-700', label: 'Medium', icon: Clock },
      low: { bg: 'bg-green-100 text-green-700', label: 'Low', icon: null },
    };
    const p = config[priority] || config.medium;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${p.bg}`}>
        {p.icon && <p.icon className="h-3 w-3" />}
        {p.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Service Requests</h1>
        <p className="text-sm text-gray-700 mt-2">
          Requests assigned to you by admin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Requests" value={stats.total} icon={FileText} />
        <StatsCard title="Pending Quote" value={stats.pendingQuote} icon={Bell} />
        <StatsCard title="Quote Submitted" value={stats.quoteSubmitted} icon={Clock} />
        <StatsCard title="High Priority" value={stats.highPriority} icon={AlertCircle} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search requests..."
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
            <option value="pending-quote">Pending Quote</option>
            <option value="quote-submitted">Quote Submitted</option>
            <option value="quote-accepted">Quote Accepted</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Requests ({filteredRequests.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {paginatedRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg text-gray-900">{request.id}</span>
                    {getStatusBadge(request.status)}
                    {getPriorityBadge(request.priority)}
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {request.serviceType}
                  </h3>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Assigned: {new Date(request.assignedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Client:</span> {request.clientName}
                  </div>
                  <div className="text-xs text-gray-500 ml-5">{request.clientEmail}</div>
                  <div className="text-xs text-gray-500 ml-5">{request.clientPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Location:</span>
                  </div>
                  <div className="text-xs text-gray-700 ml-5">{request.location}</div>
                  <div className="text-xs text-gray-500 ml-5">{request.propertyAddress}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Description:</div>
                <p className="text-sm text-gray-600">{request.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Budget:</span> {request.budget}
                </div>
                {request.status === 'pending-quote' ? (
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowQuoteModal(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Submit Quote
                  </button>
                ) : (
                  <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Quote submitted on {new Date(request.quoteSubmittedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {paginatedRequests.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No service requests found
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

      {/* Quote Modal */}
      <QuoteComposer
        isOpen={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setSelectedRequest(null);
        }}
        onSend={handleQuoteSubmit}
        ticket={selectedRequest}
      />
    </div>
  );
}
