"use client";

import { use, useState, useEffect } from "react";
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
  Eye
} from "lucide-react";

export default function ConciergeDashboard({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  
  // Mock data for demonstration
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
      notes: "Client prefers morning appointments, has specific budget requirements."
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
      notes: "Budget up to $800k, flexible move-in date."
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
      notes: "Interested in multi-family properties, needs financing guidance."
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
      notes: "International client, needs virtual tours initially."
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
      notes: "Successfully closed, client satisfied with service."
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

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
                         ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Concierge Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage client service requests and coordinate property viewings
            </p>
          </div>
          <Link 
            href={`/${locale}/dashboard/concierge/tickets`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none focus:ring-offset-2"
          >
            <Ticket className="h-4 w-4" />
            View All Tickets
          </Link>
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
          title="New Requests"
          value={stats.new}
          variant="info"
          icon={AlertCircle}
        />
        <StatsCard
          title="Scheduled"
          value={stats.scheduled}
          variant="warning"
          icon={Calendar}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          variant="success"
          icon={CheckCircle}
        />
      </div>

      {/* Recent Tickets Overview */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Service Tickets</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
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
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                >
                  <option value="all">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
                  Assigned To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id} className="transition-colors hover:bg-gray-50">
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
          {filteredTickets.slice(0, 5).map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{ticket.clientName}</h3>
                  <p className="text-sm text-gray-600">{ticket.serviceType}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
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
                  Request Date: {new Date(ticket.requestDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
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
        {filteredTickets.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Ticket className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">No service tickets match your current filters.</p>
          </div>
        )}

        {/* View All Link */}
        {filteredTickets.length > 5 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <Link 
              href={`/${locale}/dashboard/concierge/tickets`}
              className="text-sm font-medium text-[#E6B325] hover:text-[#d4a017]"
            >
              View all {filteredTickets.length} tickets →
            </Link>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Service Ticket Details"
        maxWidth="max-w-2xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
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
                  <span>{selectedTicket.clientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedTicket.clientPhone}</span>
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
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Service Type: </span>
                  <span className="text-sm text-gray-900">{selectedTicket.serviceType}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Description: </span>
                  <p className="text-sm text-gray-900 mt-1">{selectedTicket.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Priority: </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ml-2 ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status: </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Request Date: </span>
                    <span className="text-sm text-gray-900">{new Date(selectedTicket.requestDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment & Schedule */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Assignment & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Assigned To: </span>
                  <span className="text-sm text-gray-900">{selectedTicket.assignedTo || "Not assigned"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Scheduled Date: </span>
                  <span className="text-sm text-gray-900">
                    {selectedTicket.scheduledDate ? new Date(selectedTicket.scheduledDate).toLocaleDateString() : "Not scheduled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                {selectedTicket.notes || "No additional notes available."}
              </p>
            </div>

            {/* Status Update Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
