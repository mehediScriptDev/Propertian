"use client"


import React, { useMemo, useState, useEffect } from 'react'
import PartnerTable from './components/PartnerTable'
import AddPartnerModal from './components/modals/AddPartnerModal'
import axios from '../../../../../lib/axios'
import { ChevronDown, Search } from 'lucide-react'
import Pagination from '@/components/dashboard/Pagination'
import { useCallback } from 'react'

const Page = () => {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleDelete = useCallback(async (id) => {
        if (!id) return
        try {
            await axios.delete(`/partner-directory/partners/${id}`)
            setPartners(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
            setError(err?.message || 'Failed to delete partner')
        }
    }, [])

    const handleCreate = useCallback(async (payload) => {
        if (!payload) return
        try {
            const res = await axios.post('/partner-directory/partners', payload)
            const created = res?.data
            // Prepend the created partner to the list
            setPartners(prev => Array.isArray(prev) ? [created, ...prev] : [created])
        } catch (err) {
            console.error(err)
            setError(err?.message || 'Failed to create partner')
        }
    }, [])

    const categories = useMemo(() => {
        const s = new Set()
        partners.forEach(p => { if (p?.category) s.add(String(p.category).trim()) })
        return Array.from(s).sort()
    }, [partners])

    useEffect(() => {
        let mounted = true
        const fetchPartners = async () => {
            setLoading(true)
            try {
                const res = await axios.get('/partner-directory/partners')
                // axios instance returns full response here; data is at res.data
                const data = res?.data
                if (mounted) setPartners(Array.isArray(data) ? data : [])
            } catch (err) {
                // axiosInstance formats errors as objects with message/status
                console.error(err)
                if (mounted) {
                    if (err && err.status === 404) {
                        setError('Partners endpoint not found (404). Check your API base URL (NEXT_PUBLIC_API_URL) or create the route.')
                        setPartners([])
                    } else if (err && err.message) {
                        setError(err.message)
                    } else {
                        setError('Failed to load partners')
                    }
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchPartners()
        return () => { mounted = false }
    }, [])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return partners.filter(p => {
            const matchesSearch = !q || (p.id && String(p.id).toLowerCase().includes(q)) || (p.name && p.name.toLowerCase().includes(q)) || (p.email && p.email.toLowerCase().includes(q)) || (p.phone && p.phone.toLowerCase().includes(q))
            const matchesCategory = categoryFilter === 'all' || (p.category && String(p.category).trim().toLowerCase() === String(categoryFilter).trim().toLowerCase())
            return matchesSearch && matchesCategory
        })
    }, [search, categoryFilter, partners])

    // Pagination
    const ITEMS_PER_PAGE = 6
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filtered, currentPage])

    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, categoryFilter])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
    }, [])

    const paginationTranslations = {
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
    }

    const [showAddModal, setShowAddModal] = useState(false)

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Partner Directory</h1>
            <section className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className='relative flex-1 min-w-[300px]'>
                    <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Search by name, email or phone'
                        className='h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                </div>
                <div className="relative mt-4 md:mt-0">
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className='h-12 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
                </div>
            </section>
            {error ? (
                <div className="text-sm text-red-500">{error}</div>
            ) : (
                <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
                    <div className="flex items-center justify-between p-4 sm:p-6">
                        <div className="text-sm font-medium text-gray-700">Recent Partners</div>
                        <div>
                            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg  bg-primary text-white">+ Add Partner</button>
                        </div>
                    </div>
                    <PartnerTable partners={paginated} loading={loading} onDelete={handleDelete} />
                    <AddPartnerModal open={showAddModal} onClose={() => setShowAddModal(false)} onCreate={handleCreate} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filtered.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                        translations={paginationTranslations}
                    />
                </div>
            )}
        </div>
    )
}

export default Page