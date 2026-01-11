'use client';

import PartnersTable from '@/components/dashboard/admin/PartnersTable';
import Pagination from '@/components/dashboard/Pagination';

export default function ListingSubmissionsPanel({
  partners,
  loading,
  onDelete,
  onStatusChange,
  onRefresh,
  tableTranslations,
  paginationTranslations,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  return (
    <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
      
      <PartnersTable
        partners={partners}
        loading={loading}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
        translations={tableTranslations}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        translations={paginationTranslations}
      />
    </div>
  );
}
