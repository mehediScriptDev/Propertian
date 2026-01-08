"use client";

import { use, useState } from "react";
import { useTranslation } from "@/i18n";
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Eye,
  MessageCircle,
  Search,
  Filter,
  User,
  Building
} from "lucide-react";

export default function ConciergeServicesPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  
  // Mock data for client services
  const [clients] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      location: "Manhattan",
      joinDate: "2023-10-15",
      totalServices: 8,
      completedServices: 6,
      rating: 4.8,
      preferredServices: ["Property Viewing", "Investment Consultation"],
      notes: "VIP client, prefers morning appointments",
      status: "Active",
      lastService: "2024-01-15"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1-555-0456",
      location: "Brooklyn",
      joinDate: "2023-12-01",
      totalServices: 4,
      completedServices: 3,
      rating: 4.9,
      preferredServices: ["Property Search", "Market Analysis"],
      notes: "Family-oriented, budget conscious",
      status: "Active",
      lastService: "2024-01-16"
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.chen@email.com", 
      phone: "+1-555-0789",
      location: "Queens",
      joinDate: "2024-01-10",
      totalServices: 2,
      completedServices: 1,
      rating: 5.0,
      preferredServices: ["Investment Consultation", "Property Analysis"],
      notes: "First-time investor, needs guidance",
      status: "New",
      lastService: "2024-01-14"
    },
    {
      id: 4,
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "+1-555-0321",
      location: "Manhattan Upper East",
      joinDate: "2023-08-20",
      totalServices: 12,
      completedServices: 11,
      rating: 4.7,
      preferredServices: ["Relocation Services", "Luxury Properties"],
      notes: "International relocations specialist",
      status: "VIP",
      lastService: "2024-01-17"
    },
    {
      id: 5,
      name: "Robert Davis",
      email: "robert.davis@email.com",
      phone: "+1-555-0654",
      location: "Bronx",
      joinDate: "2023-11-30",
      totalServices: 6,
      completedServices: 6,
      rating: 4.6,
      preferredServices: ["Property Viewing", "Rental Services"],
      notes: "Reliable client, always on time",
      status: "Active",
      lastService: "2024-01-12"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/${locale}/dashboard/concierge`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Client Services</h1>
          <p className="text-sm text-gray-600">Manage your client relationships and service history</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">VIP Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'VIP').length}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{clients.reduce((sum, c) => sum + c.totalServices, 0)}</p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(clients.reduce((sum, c) => sum + c.rating, 0) / clients.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
          >
            <option value="all">All Clients</option>
            <option value="VIP">VIP Clients</option>
            <option value="Active">Active Clients</option>
            <option value="New">New Clients</option>
          </select>
        </div>
      </div>

      {/* Clients List */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Service
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredClients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {client.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.completedServices}/{client.totalServices}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {renderStars(client.rating)}
                      <span className="ml-1 text-sm text-gray-600">{client.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(client.lastService).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedClient(client)}
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
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {client.location}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Services: </span>
                  {client.completedServices}/{client.totalServices}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Rating: </span>
                  {renderStars(client.rating)}
                  <span>{client.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last: {new Date(client.lastService).toLocaleDateString()}
                </div>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-[#E6B325] hover:text-[#d4a017] text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">No clients match your current search and filter criteria.</p>
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Client Details</h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedClient.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedClient.email}`} className="text-[#E6B325] hover:underline">
                        {selectedClient.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedClient.phone}`} className="text-[#E6B325] hover:underline">
                        {selectedClient.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedClient.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Since: {new Date(selectedClient.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Service Stats */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Service Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900">{selectedClient.totalServices}</div>
                      <div className="text-sm text-gray-600">Total Services</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{selectedClient.completedServices}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Rating:</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedClient.rating)}
                        <span className="text-sm text-gray-600">({selectedClient.rating})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Preferred Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.preferredServices.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selectedClient.notes || "No notes available."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-[#E6B325] text-white py-2 px-4 rounded-lg hover:bg-[#d4a017] transition-colors">
                    <MessageCircle className="h-4 w-4 inline mr-2" />
                    Send Message
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Schedule Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}