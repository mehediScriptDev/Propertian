'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n';
import { ChevronDown, Search } from 'lucide-react';
import SearchFilters from './components/SearchFilters';
import SupportsTable from './components/SupportsTable';

const DUMMY_SUPPORTS = [
    { id: 'S-1001', subject: 'Unable to login', requester: 'Alice Johnson', email: 'alice@example.com', status: 'open', priority: 'high', date: '2025-11-20' },
    { id: 'S-1002', subject: 'Payment not processing', requester: 'Bob Martin', email: 'bob@example.com', status: 'pending', priority: 'medium', date: '2025-11-18' },
    { id: 'S-1003', subject: 'Listing image upload error', requester: 'Carla Ruiz', email: 'carla@example.com', status: 'closed', priority: 'low', date: '2025-11-17' },
    { id: 'S-1004', subject: 'Partner verification delay', requester: 'David Lee', email: 'david@example.com', status: 'open', priority: 'medium', date: '2025-11-15' },
    { id: 'S-1005', subject: 'Feature request: CSV export', requester: 'Eve Kim', email: 'eve@example.com', status: 'pending', priority: 'low', date: '2025-11-12' },
    { id: 'S-1006', subject: 'Dashboard performance issue', requester: 'Frank O', email: 'frank@example.com', status: 'open', priority: 'high', date: '2025-11-10' },
];

export default function AdminSupportsPage() {
    const params = useParams();
    const locale = params?.locale || 'en';
    const { t } = useTranslation(locale);

    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return DUMMY_SUPPORTS.filter((s) => {
            if (statusFilter !== 'all' && s.status !== statusFilter) return false;
            if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
            if (!q) return true;
            return (
                s.subject.toLowerCase().includes(q) ||
                s.requester.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q)
            );
        });
    }, [query, statusFilter, priorityFilter]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    // Ensure current page is within bounds after filters change
    if (currentPage > totalPages) {
        setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6 ">
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Supports</h1>
                <p className="text-base text-gray-600 mt-2">Manage support tickets and resources.</p>
            </div>

            {/* Search & Filters */}
            <SearchFilters
                query={query}
                setQuery={(v) => { setQuery(v); setCurrentPage(1); }}
                statusFilter={statusFilter}
                setStatusFilter={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                priorityFilter={priorityFilter}
                setPriorityFilter={(v) => { setPriorityFilter(v); setCurrentPage(1); }}
            />


            {/* Table / Cards */}
            <SupportsTable
                supports={paginated}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
            />
        </div>
    );
}
