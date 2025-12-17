import React from 'react'
import { Search } from 'lucide-react'

export default function SearchFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange
}) {
    return (
        <div className='bg-white rounded-lg p-4 shadow-sm'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                <div className='flex-1 w-full'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                        <input
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder='Search by ID, subject, requester or email'
                            className='w-full h-11 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className='h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
                    >
                        <option value='all'>All statuses</option>
                        <option value='open'>Open</option>
                        <option value='pending'>Pending</option>
                        <option value='closed'>Closed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className='h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'
                    >
                        <option value='all'>All priorities</option>
                        <option value='high'>High</option>
                        <option value='medium'>Medium</option>
                        <option value='low'>Low</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
