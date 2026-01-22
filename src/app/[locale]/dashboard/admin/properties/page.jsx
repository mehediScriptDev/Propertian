
// 'use client';

// import { use, useState, useMemo, useCallback, useEffect } from 'react';
// import { useTranslation } from '@/i18n';
// import { Building2, Check, Eye, X, AlertCircle } from 'lucide-react';
// import StatsCard from '@/components/dashboard/admin/StatsCard';
// import PropertiesFilters from '@/components/dashboard/admin/PropertiesFilters';
// import PropertiesListTable from '@/components/dashboard/admin/PropertiesListTable';
// import ViewPropertyModal from './components/Modals/ViewPropertyModal';
// import EditPropertyModal from './components/Modals/EditPropertyModal';
// import Pagination from '@/components/dashboard/Pagination';
// import { get, del } from '@/lib/api';

// export default function PropertiesManagementPage({ params }) {
//   const { locale } = use(params);
//   const { t } = useTranslation(locale);

//   // --- Helper: Resolve Image URL ---
//   const resolveImageUrl = (imgPath) => {
//     if (!imgPath) return '/placeholder-property.jpg';
//     if (/^https?:\/\//i.test(imgPath) || imgPath.startsWith('//')) return imgPath;
//     const base = process.env.NEXT_PUBLIC_API_URL;
//     return `${base?.replace(/\/$/, '') || ''}/${imgPath.replace(/^\//, '')}`;
//   };

//   // --- State Management ---
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Data & Status
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Modals
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProperty, setSelectedProperty] = useState(null);

//   // --- API Fetching Function (Server Side) ---
//   const fetchProperties = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Build Query Parameters
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//       });

//       if (searchTerm) queryParams.append('search', searchTerm);
//       if (statusFilter !== 'all') queryParams.append('status', statusFilter);

//       const response = await get(`/properties?${queryParams.toString()}`);

//       if (response.success && response.data) {
//         const rawProperties = response.data.properties || [];
        
//         // Map API data to UI model
//         const transformedProperties = rawProperties.map(prop => {
//           let statusDisplay = 'inactive';
//           if (prop.status === 'AVAILABLE') statusDisplay = 'available';
//           else if (prop.status === 'PENDING') statusDisplay = 'pending';
//           else if (prop.status === 'SOLD' || prop.status === 'INACTIVE') statusDisplay = 'inactive';

//           const ownerName = prop.owner
//             ? `${prop.owner.firstName ?? ''} ${prop.owner.lastName ?? ''}`.trim()
//             : 'N/A';

//           return {
//             id: prop.id,
//             title: prop.title || 'Untitled Property',
//             location: `${prop.city || ''}, ${prop.state || ''}`.replace(/^, |, $/g, '') || 'Unknown Location',
//             price: Number(prop.price) || 0,
//             priceUSD: Number(prop.price) || 0,
//             status: statusDisplay,
//             type: prop.propertyType || 'Unknown',
//             bedrooms: prop.bedrooms || 0,
//             area: prop.sqft || 0,
//             views: 0, 
//             partner: ownerName,
//             image: resolveImageUrl(prop.images?.[0]),
//           };
//         });

//         setProperties(transformedProperties);

//         // Update Pagination State
//         const pagination = response.data.pagination || {};
//         setTotalItems(pagination.totalItems || 0);
//         setTotalPages(pagination.totalPages || 0);

//         // Handle case where current page is empty but total items > 0 (e.g. after deletion)
//         if (transformedProperties.length === 0 && currentPage > 1 && pagination.totalItems > 0) {
//            setCurrentPage(prev => Math.max(1, prev - 1));
//         }
//       } else {
//         // Handle API logical failure (e.g., success: false)
//         setProperties([]);
//         setTotalItems(0);
//         // Only set error if strictly necessary, otherwise empty list is fine
//         if (response.message) setError(response.message);
//       }
//     } catch (err) {
//       console.error('Error fetching properties:', err);
//       setError('Failed to load properties. Please try again later.');
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

//   // --- Effects ---
//   useEffect(() => {
//     // Debounce fetch to prevent API spamming while typing
//     const timer = setTimeout(() => {
//         fetchProperties();
//     }, 400); 

//     return () => clearTimeout(timer);
//   }, [fetchProperties]);

//   // --- Handlers ---
//   const handleSearchChange = useCallback((value) => {
//     setSearchTerm(value);
//     setCurrentPage(1); // Reset to first page on new search
//   }, []);

//   const handleStatusChange = useCallback((value) => {
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset to first page on filter change
//   }, []);

//   const handlePageChange = useCallback((page) => {
//     setCurrentPage(page);
//   }, []);
  
//   const handleItemsPerPageChange = useCallback((newLimit) => {
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//   }, []);

//   const handleView = useCallback((property) => {
//     setSelectedProperty(property);
//     setShowViewModal(true);
//   }, []);

//   const handleEdit = useCallback((property) => {
//     setSelectedProperty(property);
//     setShowEditModal(true);
//   }, []);

//   const handleSaveEdit = useCallback(async (updated) => {
//     await fetchProperties(); 
//   }, [fetchProperties]);

//   const handleDelete = useCallback(async (property) => {
//     if (!confirm(`Are you sure you want to delete "${property.title}"?`)) {
//       return;
//     }

//     try {
//       const response = await del(`/properties/${property.id}`);
//       if (response.success) {
//         // Refresh data to reflect deletion
//         fetchProperties();
//       } else {
//         alert(response.message || 'Failed to delete property');
//       }
//     } catch (err) {
//       console.error('Error deleting property:', err);
//       alert('An error occurred while deleting the property.');
//     }
//   }, [fetchProperties]);

//   // --- Translations & Config ---
//   const propertiesTranslations = useMemo(() => ({
//       title: t('dashboard.admin.properties.title'),
//       subtitle: t('dashboard.admin.properties.subtitle'),
//       addProperty: t('dashboard.admin.properties.addProperty'),
//       searchPlaceholder: t('dashboard.admin.properties.searchPlaceholder'),
//       allStatus: t('dashboard.admin.properties.allStatus'),
//       stats: {
//         totalListings: t('dashboard.admin.properties.stats.totalListings'),
//         active: t('dashboard.admin.properties.stats.active'),
//         pending: t('dashboard.admin.properties.stats.pending'),
//         inactive: t('dashboard.admin.properties.stats.inactive'),
//       },
//       table: {
//         property: t('dashboard.admin.properties.table.property'),
//         location: t('dashboard.admin.properties.table.location'),
//         price: t('dashboard.admin.properties.table.price'),
//         status: t('dashboard.admin.properties.table.status'),
//         views: t('dashboard.admin.properties.table.views'),
//         actions: t('dashboard.admin.properties.table.actions'),
//         beds: t('dashboard.admin.properties.table.beds'),
//         view: t('dashboard.admin.properties.table.view'),
//         edit: t('dashboard.admin.properties.table.edit'),
//         delete: t('dashboard.admin.properties.table.delete'),
//       },
//       status: {
//         active: t('dashboard.admin.properties.status.active'),
//         pending: t('dashboard.admin.properties.status.pending'),
//         inactive: t('dashboard.admin.properties.status.inactive'),
//       },
//     }), [t]);

//   const paginationTranslations = useMemo(() => ({
//       previous: t('common.previous'),
//       next: t('common.next'),
//       showing: t('common.showing'),
//       to: t('common.to'),
//       of: t('common.of'),
//       results: t('common.results'),
//       rowsPerPage: t('common.rowsPerPage') || 'Rows per page',
//     }), [t]);


//   const stats = useMemo(() => [
//       {
//         label: propertiesTranslations.stats?.totalListings || 'Total Listings',
//         value: totalItems.toString(),
//         trend: '',
//         icon: Building2,
//         variant: 'primary',
//       },
//       {
//         label: propertiesTranslations.stats?.active || 'Active',
//         value: '--', // Placeholder until separate stats API is integrated
//         trend: '',
//         icon: Check,
//         variant: 'success',
//       },
//       {
//         label: propertiesTranslations.stats?.pending || 'Pending',
//         value: '--',
//         trend: '',
//         icon: Eye,
//         variant: 'warning',
//       },
//       {
//         label: propertiesTranslations.stats?.inactive || 'Inactive',
//         value: '--',
//         trend: '',
//         icon: X,
//         variant: 'info',
//       },
//     ], [propertiesTranslations, totalItems]);

//   return (
//     <div className='space-y-4 md:space-y-6'>
//       {/* Header */}
//       <div>
//         <h1 className='text-4xl font-bold text-gray-900 mb-2'>
//           {propertiesTranslations.title}
//         </h1>
//         <p className='text-base text-gray-600'>
//           {propertiesTranslations.subtitle}
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
//         {stats.map((s, idx) => (
//           <StatsCard
//             key={idx}
//             title={s.label}
//             value={s.value}
//             icon={s.icon}
//             trend={s.trend}
//           />
//         ))}
//       </div>

//       {/* Filters */}
//       <PropertiesFilters
//         searchTerm={searchTerm}
//         statusFilter={statusFilter}
//         onSearchChange={handleSearchChange}
//         onStatusChange={handleStatusChange}
//         translations={propertiesTranslations}
//       />

//       {/* Error Message Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
//             <AlertCircle className="h-5 w-5" />
//             <span className="block sm:inline">{error}</span>
//         </div>
//       )}

//       {/* Properties Table & Pagination */}
//       <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
//         <PropertiesListTable
//           properties={properties}
//           translations={propertiesTranslations}
//           onView={handleView}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           loading={loading}
//         />
        
//         <ViewPropertyModal 
//             isOpen={showViewModal} 
//             onClose={() => setShowViewModal(false)} 
//             property={selectedProperty} 
//             t={t} 
//         />
//         <EditPropertyModal 
//             isOpen={showEditModal} 
//             onClose={() => setShowEditModal(false)} 
//             property={selectedProperty} 
//             onSave={handleSaveEdit} 
//             t={t} 
//         />
        
//         {/* Only show pagination if there are items or if we are loading */}
//         {(totalItems > 0 || loading) && (
//             <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={handlePageChange}
//                 onItemsPerPageChange={handleItemsPerPageChange}
//                 itemsPerPageOptions={[5, 10, 20, 50]}
//                 showItemsPerPage={true}
//                 translations={paginationTranslations}
//             />
//         )}
//       </div>
//     </div>
//   );
// }









'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Building2, Check, Eye, X, AlertCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/admin/StatsCard';
import PropertiesFilters from '@/components/dashboard/admin/PropertiesFilters';
import PropertiesListTable from '@/components/dashboard/admin/PropertiesListTable';
import ViewPropertyModal from './components/Modals/ViewPropertyModal';
import EditPropertyModal from './components/Modals/EditPropertyModal';
import Pagination from '@/components/dashboard/Pagination';
import { get, del } from '@/lib/api';

export default function PropertiesManagementPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // --- Helper: Resolve Image URL ---
  const resolveImageUrl = (imgPath) => {
    if (!imgPath) return '/placeholder-property.jpg';
    if (/^https?:\/\//i.test(imgPath) || imgPath.startsWith('//')) return imgPath;
    const base = process.env.NEXT_PUBLIC_API_URL;
    return `${base?.replace(/\/$/, '') || ''}/${imgPath.replace(/^\//, '')}`;
  };

  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- API Fetching Function (Server Side) ---
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const response = await get(`/properties?${queryParams.toString()}`);

      if (response.success && response.data) {
        const rawProperties = response.data.properties || [];
        
        const transformedProperties = rawProperties.map(prop => {
          let statusDisplay = 'inactive';
          if (prop.status === 'AVAILABLE') statusDisplay = 'available';
          else if (prop.status === 'PENDING') statusDisplay = 'pending';
          else if (prop.status === 'SOLD' || prop.status === 'INACTIVE') statusDisplay = 'inactive';

          const ownerName = prop.owner
            ? `${prop.owner.firstName ?? ''} ${prop.owner.lastName ?? ''}`.trim()
            : 'N/A';

          return {
            id: prop.id,
            title: prop.title || 'Untitled Property',
            location: `${prop.city || ''}, ${prop.state || ''}`.replace(/^, |, $/g, '') || 'Unknown Location',
            price: Number(prop.price) || 0,
            priceUSD: Number(prop.price) || 0,
            status: statusDisplay,
            type: prop.propertyType || 'Unknown',
            bedrooms: prop.bedrooms || 0,
            area: prop.sqft || 0,
            views: 0, 
            partner: ownerName,
            image: resolveImageUrl(prop.images?.[0]),
          };
        });

        setProperties(transformedProperties);

        const pagination = response.data.pagination || {};
        setTotalItems(pagination.totalItems || 0);
        setTotalPages(pagination.totalPages || 0);

        if (transformedProperties.length === 0 && currentPage > 1 && pagination.totalItems > 0) {
           setCurrentPage(prev => Math.max(1, prev - 1));
        }
      } else {
        setProperties([]);
        setTotalItems(0);
        if (response.message) setError(response.message);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProperties();
    }, 400); 

    return () => clearTimeout(timer);
  }, [fetchProperties]);

  // --- Handlers ---
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  
  const handleItemsPerPageChange = useCallback((newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  const handleView = useCallback((property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  }, []);

  const handleEdit = useCallback((property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(async (updated) => {
    await fetchProperties(); 
  }, [fetchProperties]);

  // --- UPDATED DELETE HANDLER ---
  const handleDelete = useCallback(async (property) => {
    // 1. Confirm Pop-up (OK করলে ডিলিট হবে, Cancel করলে কিছুই হবে না)
    if (!confirm(`Are you sure you want to delete "${property.title}"?`)) {
      return;
    }

    try {
      const response = await del(`/properties/${property.id}`);
      
      if (response.success) {
        // 2. Real-time Update: UI থেকে সাথে সাথে রিমুভ (কোনো Alert ছাড়াই)
        setProperties(prevProperties => 
            prevProperties.filter(p => p.id !== property.id)
        );
        setTotalItems(prev => Math.max(0, prev - 1));

        // পেজের শেষ আইটেম ডিলিট হলে আগের পেজে যাওয়া
        if (properties.length === 1 && currentPage > 1) {
             setCurrentPage(prev => prev - 1);
        }
      } else {
        // ফেইল হলে কনসোলে এরর দেখাবে, কিন্তু উইন্ডো Alert আসবে না
        console.error(response.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  }, [properties, currentPage]); 

  // --- Translations & Config ---
  const propertiesTranslations = useMemo(() => ({
      title: t('dashboard.admin.properties.title'),
      subtitle: t('dashboard.admin.properties.subtitle'),
      addProperty: t('dashboard.admin.properties.addProperty'),
      searchPlaceholder: t('dashboard.admin.properties.searchPlaceholder'),
      allStatus: t('dashboard.admin.properties.allStatus'),
      stats: {
        totalListings: t('dashboard.admin.properties.stats.totalListings'),
        active: t('dashboard.admin.properties.stats.active'),
        pending: t('dashboard.admin.properties.stats.pending'),
        inactive: t('dashboard.admin.properties.stats.inactive'),
      },
      table: {
        property: t('dashboard.admin.properties.table.property'),
        location: t('dashboard.admin.properties.table.location'),
        price: t('dashboard.admin.properties.table.price'),
        status: t('dashboard.admin.properties.table.status'),
        views: t('dashboard.admin.properties.table.views'),
        actions: t('dashboard.admin.properties.table.actions'),
        beds: t('dashboard.admin.properties.table.beds'),
        view: t('dashboard.admin.properties.table.view'),
        edit: t('dashboard.admin.properties.table.edit'),
        delete: t('dashboard.admin.properties.table.delete'),
      },
      status: {
        active: t('dashboard.admin.properties.status.active'),
        pending: t('dashboard.admin.properties.status.pending'),
        inactive: t('dashboard.admin.properties.status.inactive'),
      },
    }), [t]);

  const paginationTranslations = useMemo(() => ({
      previous: t('common.previous'),
      next: t('common.next'),
      showing: t('common.showing'),
      to: t('common.to'),
      of: t('common.of'),
      results: t('common.results'),
      rowsPerPage: t('common.rowsPerPage') || 'Rows per page',
    }), [t]);


  const stats = useMemo(() => [
      {
        label: propertiesTranslations.stats?.totalListings || 'Total Listings',
        value: totalItems.toString(),
        trend: '',
        icon: Building2,
        variant: 'primary',
      },
      {
        label: propertiesTranslations.stats?.active || 'Active',
        value: '--',
        trend: '',
        icon: Check,
        variant: 'success',
      },
      {
        label: propertiesTranslations.stats?.pending || 'Pending',
        value: '--',
        trend: '',
        icon: Eye,
        variant: 'warning',
      },
      {
        label: propertiesTranslations.stats?.inactive || 'Inactive',
        value: '--',
        trend: '',
        icon: X,
        variant: 'info',
      },
    ], [propertiesTranslations, totalItems]);

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>
          {propertiesTranslations.title}
        </h1>
        <p className='text-base text-gray-600'>
          {propertiesTranslations.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((s, idx) => (
          <StatsCard
            key={idx}
            title={s.label}
            value={s.value}
            icon={s.icon}
            trend={s.trend}
          />
        ))}
      </div>

      {/* Filters */}
      <PropertiesFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        translations={propertiesTranslations}
      />

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
            <AlertCircle className="h-5 w-5" />
            <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Properties Table & Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <PropertiesListTable
          properties={properties}
          translations={propertiesTranslations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
        
        <ViewPropertyModal 
            isOpen={showViewModal} 
            onClose={() => setShowViewModal(false)} 
            property={selectedProperty} 
            t={t} 
        />
        <EditPropertyModal 
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)} 
            property={selectedProperty} 
            onSave={handleSaveEdit} 
            t={t} 
        />
        
        {(totalItems > 0 || loading) && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[5, 10, 20, 50]}
                showItemsPerPage={true}
                translations={paginationTranslations}
            />
        )}
      </div>
    </div>
  );
}