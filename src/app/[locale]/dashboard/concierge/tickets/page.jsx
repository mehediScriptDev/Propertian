"use client";

import { use, useState } from "react";
import { useTranslation } from "@/i18n";
import StatsCard from "@/components/dashboard/admin/StatsCard";
import Modal from '@/components/Modal';
import Link from 'next/link';
import {
  Ticket,
  Clock,
  CheckCircle,
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageCircle,
  AlertCircle,
  Eye,
  ArrowLeft,
  Plus,
  Download,
  FileText
} from "lucide-react";

export default function ConciergeTicketsPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // Mock data for tickets page (design-focused)
  const [tickets, setTickets] = useState([
    {
      id: 1,
      clientName: "John Smith",
      clientEmail: "john.smith@email.com",
      clientPhone: "+1-555-0123",
      serviceType: "Property Viewing",
      location: "Downtown Manhattan",
      requestDate: "2024-01-15",
      scheduledDate: "2024-01-20",
      priority: "High",
      status: "Assigned",
      description: "Client wants to view 3 bedroom apartments in downtown area with modern amenities.",
      assignedTo: "Sarah Wilson",
      notes: "Client prefers morning appointments, has specific budget requirements.",
      estimatedDuration: "2 hours",
      budget: "$500k - $800k"
    },
    {
      id: 2,
      clientName: "Maria Garcia",
      clientEmail: "maria.garcia@email.com",
      clientPhone: "+1-555-0456",
      serviceType: "Property Search",
      location: "Brooklyn Heights",
      requestDate: "2024-01-16",
      scheduledDate: null,
      priority: "Medium",
      status: "In Review",
      description: "Looking for family home with garden space, 4+ bedrooms, near good schools.",
      assignedTo: null,
      notes: "Budget up to $800k, flexible move-in date.",
      estimatedDuration: "1 hour",
      budget: "Up to $800k"
    },
    {
      id: 3,
      clientName: "David Chen",
      clientEmail: "david.chen@email.com",
      clientPhone: "+1-555-0789",
      serviceType: "Investment Consultation",
      location: "Queens",
      requestDate: "2024-01-14",
      scheduledDate: "2024-01-19",
      priority: "High",
      status: "Scheduled",
      description: "First-time investor seeking advice on rental property investment opportunities.",
      assignedTo: "Michael Johnson",
      notes: "Interested in multi-family properties, needs financing guidance.",
      estimatedDuration: "1.5 hours",
      budget: "$300k - $500k"
    },
    {
      id: 4,
      clientName: "Emma Thompson",
      clientEmail: "emma.thompson@email.com",
      clientPhone: "+1-555-0321",
      serviceType: "Relocation Services",
      location: "Manhattan Upper East",
      requestDate: "2024-01-17",
      scheduledDate: null,
      priority: "Low",
      status: "New",
      description: "Relocating from London, needs comprehensive area information and viewing assistance.",
      assignedTo: null,
      notes: "International client, needs virtual tours initially.",
      estimatedDuration: "3 hours",
      budget: "$600k - $1M"
    },
    {
      id: 5,
      clientName: "Robert Davis",
      clientEmail: "robert.davis@email.com",
      clientPhone: "+1-555-0654",
      serviceType: "Property Viewing",
      location: "Bronx",
      requestDate: "2024-01-12",
      scheduledDate: "2024-01-18",
      priority: "Medium",
      status: "Completed",
      description: "Viewed multiple properties, made decision on 2BR apartment with parking.",
      assignedTo: "Sarah Wilson",
      notes: "Successfully closed, client satisfied with service.",
      estimatedDuration: "1.5 hours",
      budget: "$350k - $450k"
    },
    {
      id: 6,
      clientName: "Lisa Anderson",
      clientEmail: "lisa.anderson@email.com",
      clientPhone: "+1-555-0987",
      serviceType: "Market Analysis",
      location: "Williamsburg",
      requestDate: "2024-01-18",
      scheduledDate: null,
      priority: "Medium",
      status: "New",
      description: "Needs detailed market analysis for potential property investment in Williamsburg area.",
      assignedTo: null,
      notes: "Looking for trends and growth potential data.",
      estimatedDuration: "2 hours",
      budget: "Consultation fee: $200"
    },
    {
      id: 7,
      clientName: "James Wilson",
      clientEmail: "james.wilson@email.com",
      clientPhone: "+1-555-0555",
      serviceType: "Property Viewing",
      location: "Midtown",
      requestDate: "2024-01-13",
      scheduledDate: "2024-01-21",
      priority: "High",
      status: "Scheduled",
      description: "Corporate relocation, needs luxury apartment viewing for executive.",
      assignedTo: "Michael Johnson",
      notes: "Company budget, high-end requirements, quick decision needed.",
      estimatedDuration: "2.5 hours",
      budget: "$2M - $3M"
    },
    {
      id: 8,
      clientName: "Sophie Martinez",
      clientEmail: "sophie.martinez@email.com",
      clientPhone: "+1-555-0444",
      serviceType: "Rental Search",
      location: "East Village",
      requestDate: "2024-01-19",
      scheduledDate: null,
      priority: "Low",
      status: "In Review",
      description: "Young professional looking for studio or 1BR rental in trendy area.",
      assignedTo: "Sarah Wilson",
      notes: "Prefers walkable neighborhoods, budget conscious.",
      estimatedDuration: "1 hour",
      budget: "$2,500 - $3,500/month"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate stats
  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'New').length,
    inReview: tickets.filter(t => t.status === 'In Review').length,
    assigned: tickets.filter(t => t.status === 'Assigned').length,
    scheduled: tickets.filter(t => t.status === 'Scheduled').length,
    completed: tickets.filter(t => t.status === 'Completed').length,
    highPriority: tickets.filter(t => t.priority === 'High').length
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || ticket.serviceType === serviceTypeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesServiceType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Review': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const exportTickets = () => {
    // This would typically export to CSV or Excel
    console.log("Exporting tickets:", filteredTickets);
    // Implementation for actual export functionality
  };

  const serviceTypes = [...new Set(tickets.map(t => t.serviceType))];

  const handleActionClick = (ticket) => {
    // Emulate action handlers used by design: create quote, view quote, mark delivered, view details
    if (ticket.status === 'New') {
      // navigate to create quote - placeholder
      alert(`Create quote for ${ticket.clientName}`);
    } else if (ticket.status === 'In Review') {
      alert(`View quote for ${ticket.clientName}`);
    } else if (ticket.status === 'Scheduled') {
      // mark delivered
      updateTicketStatus(ticket.id, 'Completed');
    } else {
      setSelectedTicket(ticket);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top header */}
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Assigned Tickets</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track all client service requests</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <button
              onClick={exportTickets}
              className="px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 flex items-center gap-2 font-medium transition-colors"
            >
              <Download className="h-4 w-4" /> Export
            </button> */}
            <Link href="/dashboard/concierge" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none focus:ring-offset-2">
              <Plus className="h-4 w-4" /> New Proposals
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="New Requests"
          value={stats.new}
          variant="primary"
          icon={Ticket}
        />
        <StatsCard
          title="Pending Quotes"
          value={stats.inReview}
          variant="warning"
          icon={FileText}
        />
        <StatsCard
          title="Scheduled Services"
          value={stats.scheduled}
          variant="info"
          icon={Calendar}
        />
        <StatsCard
          title="Completed this Month"
          value={stats.completed}
          variant="success"
          icon={CheckCircle}
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets by client, service type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
            >
              <option value="all">Status</option>
              <option value="New">New</option>
              <option value="In Review">Quote Sent</option>
              <option value="Assigned">Assigned</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={"all"}
              onChange={() => {}}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
            >
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Requested</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details (Brief)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">#{ticket.id.toString().padStart(4,'0')}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{ticket.clientName}</div>
                    <div className="text-sm text-gray-500">{ticket.clientEmail}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{ticket.serviceType}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate max-w-[18rem]">{ticket.location}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{ticket.scheduledDate ? new Date(ticket.scheduledDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleActionClick(ticket)}
                      className={
                          ticket.status === 'New'
                            ? 'min-w-[120px] px-4 py-2 bg-[#E6B325] text-white rounded-md text-sm font-medium hover:bg-[#d4a017] transition-colors'
                            : ticket.status === 'In Review'
                            ? 'min-w-[120px] px-4 py-2 border border-[#E6B325] text-[#E6B325] bg-white rounded-md text-sm font-medium hover:bg-[#fff8e6] transition-colors'
                            : ticket.status === 'Scheduled'
                            ? 'min-w-[120px] px-4 py-2 bg-[#E6B325] text-white rounded-md text-sm font-medium hover:bg-[#d4a017] transition-colors'
                            : 'min-w-[120px] px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors'
                        }
                    >
                      {ticket.status === 'New' && 'Create Quote'}
                      {ticket.status === 'In Review' && 'View Quote'}
                      {ticket.status === 'Scheduled' && 'Mark Delivered'}
                      {['Assigned','Completed'].includes(ticket.status) && 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/50 rounded-lg border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal (kept from original) */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Service Ticket #${selectedTicket?.id.toString().padStart(4,'0')}`} maxWidth="max-w-3xl">
        {selectedTicket && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority} Priority</span>
              </div>
              <div className="text-sm text-gray-500">Created: {new Date(selectedTicket.requestDate).toLocaleDateString()}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Client</h3>
                <div className="mt-2 text-sm text-gray-900">{selectedTicket.clientName}</div>
                <div className="text-sm text-gray-500">{selectedTicket.clientEmail}</div>
                <div className="text-sm text-gray-500">{selectedTicket.clientPhone}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Service</h3>
                <div className="mt-2 text-sm text-gray-900">{selectedTicket.serviceType}</div>
                <div className="text-sm text-gray-500 mt-2">{selectedTicket.location}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="mt-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedTicket.description}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-100 rounded-md">Add Note</button>
              <button className="px-3 py-1 bg-gray-100 rounded-md">Send Message</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}