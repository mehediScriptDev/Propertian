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
  
  // Extended mock data for tickets page
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

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/${locale}/dashboard/concierge`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Service Tickets</h1>
          <p className="text-sm text-gray-600">Manage and track all client service requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportTickets}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6B325] text-white rounded-lg hover:bg-[#d4a017] transition-colors text-sm font-medium">
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          variant="primary"
          icon={Ticket}
        />
        <StatsCard
          title="Pending Review"
          value={stats.new + stats.inReview}
          variant="warning"
          icon={Clock}
        />
        <StatsCard
          title="Active"
          value={stats.assigned + stats.scheduled}
          variant="info"
          icon={Users}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          variant="success"
          icon={CheckCircle}
        />
      </div>

      {/* Filters and Search */}
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
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Assigned">Assigned</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
            >
              <option value="all">All Services</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentTickets.map((ticket) => (
                <tr key={ticket.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">#{ticket.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.clientName}</div>
                        <div className="text-sm text-gray-500">{ticket.clientEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ticket.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {ticket.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(ticket.requestDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {ticket.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-[#E6B325] hover:text-[#d4a017] text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-gray-200 lg:hidden">
          {currentTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">#{ticket.id.toString().padStart(4, '0')}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{ticket.clientName}</h3>
                  <p className="text-sm text-gray-600">{ticket.serviceType}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {ticket.location}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  {ticket.assignedTo || "Unassigned"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {new Date(ticket.requestDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="text-[#E6B325] hover:text-[#d4a017] text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentTickets.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Ticket className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">No tickets match your current search and filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/50 rounded-lg border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
          </div>
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

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Service Ticket #${selectedTicket?.id.toString().padStart(4, '0')}`}
        maxWidth="max-w-3xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority} Priority
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(selectedTicket.requestDate).toLocaleDateString()}
              </div>
            </div>

            {/* Client Information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{selectedTicket.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${selectedTicket.clientEmail}`} className="text-[#E6B325] hover:underline">
                    {selectedTicket.clientEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${selectedTicket.clientPhone}`} className="text-[#E6B325] hover:underline">
                    {selectedTicket.clientPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedTicket.location}</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Service Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Service Type:</span>
                    <div className="mt-1">{selectedTicket.serviceType}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estimated Duration:</span>
                    <div className="mt-1">{selectedTicket.estimatedDuration}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Budget:</span>
                    <div className="mt-1">{selectedTicket.budget}</div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="mt-1 text-gray-900 bg-gray-50 rounded-lg p-3">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment & Schedule */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Assigned To:</span>
                  <div className="mt-1">{selectedTicket.assignedTo || "Not assigned"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Scheduled Date:</span>
                  <div className="mt-1">
                    {selectedTicket.scheduledDate ? new Date(selectedTicket.scheduledDate).toLocaleDateString() : "Not scheduled"}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  {selectedTicket.notes || "No additional notes available."}
                </p>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Quick Actions:</span>
              {selectedTicket.status === 'New' && (
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'In Review')}
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  Move to Review
                </button>
              )}
              {selectedTicket.status === 'In Review' && (
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'Assigned')}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Assign
                </button>
              )}
              {selectedTicket.status === 'Assigned' && (
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'Scheduled')}
                  className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Schedule
                </button>
              )}
              {selectedTicket.status === 'Scheduled' && (
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'Completed')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Add Note
              </button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}