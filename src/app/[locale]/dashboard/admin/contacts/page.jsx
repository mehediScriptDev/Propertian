"use client"

import React, { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import Pagination from '@/components/dashboard/Pagination'
import ContactsTable from './components/ContactsTable'
import ContactDetailsModal from './components/ContactDetailsModal'
import UpdateStatusModal from './components/UpdateStatusModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import { ChevronDown, Search } from 'lucide-react'

export default function ContactsAdminPage() {
    const [contacts, setContacts] = useState([])
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selected, setSelected] = useState(null)
    const [editContact, setEditContact] = useState(null)
    const [deleteContact, setDeleteContact] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 6

    const fetchContacts = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get('/contact')
            const root = res?.data ?? {}
            const data = root?.data ?? root
            const list = data?.contacts ?? data
            setContacts(Array.isArray(list) ? list : [])
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.message || err?.message || 'Failed to load contacts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    const filtered = useMemo(() => {
        let result = contacts

        // Search filter
        if (q) {
            const s = q.toLowerCase()
            result = result.filter(c => {
                return (
                    (c.fullName || '').toLowerCase().includes(s) ||
                    (c.email || '').toLowerCase().includes(s) ||
                    (c.subject || '').toLowerCase().includes(s) ||
                    (c.id || '').toString().toLowerCase().includes(s)
                )
            })
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(c => (c.status || 'UNREAD').toUpperCase() === statusFilter.toUpperCase())
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            result = result.filter(c => (c.priority || 'low').toLowerCase() === priorityFilter)
        }

        return result
    }, [contacts, q, statusFilter, priorityFilter])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filtered.slice(start, start + ITEMS_PER_PAGE)
    }, [filtered, currentPage])

    const handlePageChange = (page) => setCurrentPage(page)

    const handleViewDetails = (contact) => setSelected(contact)

    const handleEdit = (contact) => {
        setEditContact(contact)
    }

    const handleStatusUpdate = () => {
        fetchContacts()
    }

    const handleDelete = (contact) => {
        setDeleteContact(contact)
    }

    const handleConfirmDelete = () => {
        fetchContacts()
    }

    const paginationTranslations = {
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-4xl font-bold text-gray-900 '>Contacts</h1>


            </div>

            {/* Filters Section */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    {/* Search Bar */}
                    <div className='relative flex-1 min-w-[300px]'>
                        <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                        <input
                            type='search'
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder='Search by ID, subject, requester or email'
                            className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                        />
                    </div>

                    {/* Status Filter */}
                    <div className='relative'>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
                        >
                            <option value='all'>All statuses</option>
                            <option value='unread'>Unread</option>
                            <option value='read'>Read</option>
                            <option value='replied'>Replied</option>
                        </select>
                        <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
                    </div>
                </div>
            </div>


            <section className='rounded-lg bg-white shadow-sm overflow-hidden'>
                {error ? (
                    <div className='p-4 text-sm text-red-600'>{error}</div>
                ) : (
                    <>
                        <ContactsTable
                            contacts={paginatedContacts}
                            loading={loading}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                            translations={paginationTranslations}
                        />
                    </>
                )}
            </section>

            <ContactDetailsModal
                contact={selected}
                onClose={() => setSelected(null)}
            />

            <UpdateStatusModal
                contact={editContact}
                onClose={() => setEditContact(null)}
                onUpdate={handleStatusUpdate}
            />

            <DeleteConfirmationModal
                contact={deleteContact}
                onClose={() => setDeleteContact(null)}
                onDelete={handleConfirmDelete}
            />
        </div>
    )
}