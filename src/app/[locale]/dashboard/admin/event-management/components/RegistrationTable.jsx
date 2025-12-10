import React, { useState, useMemo } from 'react';
import Pagination from '@/components/dashboard/Pagination';

const formatDate = (d) => {
    if (!d) return '-';
    try {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        return d;
    }
};

const RegistrationTable = ({ registrations, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate pagination
    const totalItems = registrations.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRegistrations = registrations.slice(startIndex, endIndex);

    // Pagination translations
    
    const paginationTranslations = useMemo(
        () => ({
           previous:"Previous",
            next: "Next",
            showing: "Showing",
            to:"to",
            of: "of",
            results: "results",}),[]
    )

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    if (loading) {
        return <p className="text-gray-600">Loading registrations...</p>;
    }

    if (registrations.length === 0) {
        return <p className="text-gray-600">No registrations yet.</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                NAME
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                EMAIL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                PHONE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                DATE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentRegistrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {reg.fullName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(reg.createdAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{reg.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{reg.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{formatDate(reg.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${reg.status === 'CONFIRMED'
                                        ? 'bg-blue-100 text-blue-700'
                                        : reg.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {reg.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    translations={paginationTranslations}
                />
            )}
        </div>
    );
};

export default RegistrationTable;
