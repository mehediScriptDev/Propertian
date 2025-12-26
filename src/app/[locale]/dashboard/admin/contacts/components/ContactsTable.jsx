
import { Eye, Edit, Trash2 } from 'lucide-react'

export default function ContactsTable({ contacts, loading = false, onViewDetails, onEdit, onDelete }) {
    // Show loading state
    if (loading) {
        return (
            <div className="relative min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-sm font-medium text-gray-700">Loading contacts...</p>
                </div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className='p-8 text-center text-sm text-gray-500'>
                No contacts match your search.
            </div>
        )
    }

    return (
        <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
            {/* Card Header */}
            <div className='px-6 py-5 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-gray-900'>All Contacts Request</h2>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>NAME</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>EMAIL</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>PHONE</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>STATUS</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>DATE</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {contacts.map(c => {
                            const status = (c.status || 'UNREAD').toUpperCase()

                            return (
                                <tr key={c.id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {c.subject || c.fullName || '—'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-600'>
                                        {c.email || '—'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {c.countryCode && c.phone ? `${c.countryCode} ${c.phone}` : c.phone || '—'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'REPLIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                            status === 'UNREAD' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                                status === 'READ' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                                    'bg-slate-50 text-slate-600 border border-slate-200'
                                            }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                        {c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '—'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                        <div className='flex items-center gap-4'>
                                            <button
                                                onClick={() => onViewDetails(c)}
                                                title='View'
                                                className='text-gray-500 hover:text-gray-700'
                                            >
                                                <Eye className='h-4 w-5' />
                                            </button>
                                            <button
                                                onClick={() => onEdit(c)}
                                                title='Edit'
                                                className='text-blue-500 hover:text-blue-700'
                                            >
                                                <Edit className='h-4 w-4' />
                                            </button>
                                            <button
                                                onClick={() => onDelete(c)}
                                                title='Delete'
                                                className='text-red-500 hover:text-red-700'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className='block md:hidden divide-y divide-gray-200'>
                {contacts.map(c => {
                    const status = (c.status || 'UNREAD').toUpperCase()

                    return (
                        <div key={c.id} className='p-4 hover:bg-gray-50 transition-colors'>
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex-1'>
                                    <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                                        {c.subject || c.fullName || '—'}
                                    </h3>
                                    <p className='text-xs text-blue-600 mb-1'>{c.email || '—'}</p>
                                    <p className='text-xs text-gray-600'>
                                        {c.countryCode && c.phone ? `${c.countryCode} ${c.phone}` : c.phone || '—'}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'REPLIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                    status === 'UNREAD' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                        status === 'READ' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                            'bg-slate-50 text-slate-600 border border-slate-200'
                                    }`}>
                                    {status}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-xs text-gray-500'>
                                    {c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '—'}
                                </span>
                                <div className='flex items-center gap-3'>
                                    <button
                                                onClick={() => onViewDetails(c)}
                                                title='View'
                                                className='text-gray-500 hover:text-gray-700'
                                            >
                                                <Eye className='h-4 w-5' />
                                            </button>
                                            <button
                                                onClick={() => onEdit(c)}
                                                title='Edit'
                                                className='text-blue-500 hover:text-blue-700'
                                            >
                                                <Edit className='h-4 w-4' />
                                            </button>
                                            <button
                                                onClick={() => onDelete(c)}
                                                title='Delete'
                                                className='text-red-500 hover:text-red-700'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
