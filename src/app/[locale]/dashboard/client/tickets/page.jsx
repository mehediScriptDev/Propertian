'use client';
import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';

export default function UserTicketDashboard() {
    const [tickets, setTickets] = useState([
        {
            id: 1,
            property_id: 301,
            property_name: 'Mohammadpur Apartment',
            subject: 'Payment Issue',
            description: 'Having trouble with property rent payment',
            status: 'open',
            priority: 'high',
            created_at: '2025-01-10',
            replies_count: 3
        },
        {
            id: 2,
            property_id: 302,
            property_name: 'Dhanmondi Flat',
            subject: 'Maintenance Request',
            description: 'Roof repair needed',
            status: 'in_progress',
            priority: 'medium',
            created_at: '2025-01-08',
            replies_count: 1
        },
        {
            id: 3,
            property_id: 303,
            property_name: 'Gulshan Residence',
            subject: 'Documentation Help',
            description: 'Questions about legal documents',
            status: 'resolved',
            priority: 'low',
            created_at: '2025-01-05',
            replies_count: 5
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState('');

    const [newTicket, setNewTicket] = useState({
        property_id: '',
        property_name: '',
        subject: '',
        description: '',
        priority: 'medium'
    });

    const getStatusIcon = (status) => {
        if (status === 'open') return <AlertCircle className="w-5 h-5 text-red-500" />;
        if (status === 'in_progress') return <Clock className="w-5 h-5 text-blue-500" />;
        if (status === 'resolved') return <CheckCircle className="w-5 h-5 text-green-500" />;
    };

    const getStatusText = (status) => {
        if (status === 'open') return 'Open';
        if (status === 'in_progress') return 'In Progress';
        if (status === 'resolved') return 'Resolved';
    };

    const getStatusColor = (status) => {
        if (status === 'open') return 'bg-red-50 border-red-200';
        if (status === 'in_progress') return 'bg-blue-50 border-blue-200';
        if (status === 'resolved') return 'bg-green-50 border-green-200';
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            high: 'bg-red-100 text-red-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-green-100 text-green-700'
        };
        const labels = { high: 'High', medium: 'Medium', low: 'Low' };
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[priority]}`}>
                {labels[priority]}
            </span>
        );
    };

    const handleAddTicket = () => {
        if (newTicket.subject && newTicket.description && newTicket.property_id) {
            const ticket = {
                id: Math.max(...tickets.map(t => t.id), 0) + 1,
                property_id: parseInt(newTicket.property_id),
                property_name: newTicket.property_name,
                subject: newTicket.subject,
                description: newTicket.description,
                priority: newTicket.priority,
                status: 'open',
                created_at: new Date().toISOString().split('T')[0],
                replies_count: 0
            };
            setTickets([ticket, ...tickets]);
            setNewTicket({
                property_id: '',
                property_name: '',
                subject: '',
                description: '',
                priority: 'medium'
            });
            setShowForm(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.property_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Statistics
    const stats = {
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        total: tickets.length
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
                    <p className="text-gray-600">Manage all your support requests in one place</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-gray-600 mt-2">Total Tickets</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="text-3xl font-bold text-red-600">{stats.open}</div>
                        <div className="text-sm text-gray-600 mt-2">Open</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                        <div className="text-3xl font-bold text-yellow-600">{stats.in_progress}</div>
                        <div className="text-sm text-gray-600 mt-2">In Progress</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                        <div className="text-sm text-gray-600 mt-2">Resolved</div>
                    </div>
                </div>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {/* Use the reusable StatsCard component for consistent styling and smaller markup */}
                    <StatsCard title="Total Tickets" value={stats.total} trend="+0%" variant="primary" />
                    <StatsCard title="Open" value={stats.open} trend="+0%" variant="warning" />
                    <StatsCard title="In Progress" value={stats.in_progress} trend="+0%" variant="info" />
                    <StatsCard title="Resolved" value={stats.resolved} trend="+0%" variant="success" />
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    <div className="flex-1 min-w-64 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            New Ticket
                        </button>
                    </div>
                </div>

                {/* Create New Ticket Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create New Ticket</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property ID</label>
                                <input
                                    type="number"
                                    placeholder="Property ID"
                                    value={newTicket.property_id}
                                    onChange={(e) => setNewTicket({ ...newTicket, property_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                                <input
                                    type="text"
                                    placeholder="Property Name"
                                    value={newTicket.property_name}
                                    onChange={(e) => setNewTicket({ ...newTicket, property_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Ticket subject"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Describe your issue in detail..."
                                value={newTicket.description}
                                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleAddTicket}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                Create Ticket
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Tickets List */}
                <div className="space-y-4">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-pointer hover:shadow-lg transition ${getStatusColor(ticket.status)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(ticket.status)}
                                            <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                                            {getPriorityBadge(ticket.priority)}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="font-medium">{ticket.property_name} (ID: {ticket.property_id})</span>
                                            <span>Created: {ticket.created_at}</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-4 h-4" />
                                                {ticket.replies_count} replies
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                            #{ticket.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No tickets found</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Create your first ticket
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Ticket #{selectedTicket.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                                    <p className="flex items-center gap-2 mt-1">
                                        {getStatusIcon(selectedTicket.status)}
                                        <span className="font-medium">{getStatusText(selectedTicket.status)}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Priority</p>
                                    <p className="mt-1">{getPriorityBadge(selectedTicket.priority)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Property</p>
                                    <p className="font-medium mt-1">{selectedTicket.property_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Created</p>
                                    <p className="font-medium mt-1">{selectedTicket.created_at}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Description</p>
                                <p className="text-gray-700 leading-relaxed">{selectedTicket.description}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Add Reply</p>
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    rows="3"
                                />
                                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                                    Send Reply
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}