'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Building2, Check, Eye, X } from 'lucide-react';
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

  // Helper to build correct image URL. If the API returns a full URL, use it as-is.
  const resolveImageUrl = (imgPath) => {
    if (!imgPath) return '/placeholder-property.jpg';
    if (/^https?:\/\//i.test(imgPath) || imgPath.startsWith('//')) return imgPath;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${base.replace(/\/$/, '')}/${imgPath.replace(/^\//, '')}`;
  };

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants
  const ITEMS_PER_PAGE = 5;

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await get('/properties?page=1&limit=1000');
        if (response.success && response.data?.properties) {
          // Transform API data to match component structure
          const transformedProperties = response.data.properties.map(prop => {
            // Map API status to filter status
            let statusDisplay = 'inactive';
            if (prop.status === 'AVAILABLE') statusDisplay = 'available';
            else if (prop.status === 'PENDING') statusDisplay = 'pending';
            else if (prop.status === 'SOLD' || prop.status === 'INACTIVE') statusDisplay = 'inactive';

            return {
              id: prop.id,
              title: prop.title,
              location: `${prop.city}, ${prop.state}`,
              price: parseFloat(prop.price),
              priceUSD: parseFloat(prop.price),
              status: statusDisplay,
              type: prop.propertyType,
              bedrooms: prop.bedrooms,
              area: prop.sqft,
              views: 0, // API doesn't provide views yet
              partner: `${prop.owner.firstName} ${prop.owner.lastName}`,
              image: resolveImageUrl(prop.images?.[0]),
            };
          });
          setProperties(transformedProperties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Memoized translations
  const propertiesTranslations = useMemo(
    () => ({
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
    }),
    [t]
  );

  // Stats configuration - Calculate from real data
  const stats = useMemo(() => {
    const totalCount = properties.length;
    const activeCount = properties.filter(p => p.status === 'available').length;
    const pendingCount = properties.filter(p => p.status === 'pending').length;
    const inactiveCount = properties.filter(p => p.status === 'inactive' || p.status === 'sold').length;

    return [
      {
        label: propertiesTranslations.stats.totalListings,
        value: totalCount.toString(),
        trend: '+12.5%',
        icon: Building2,
        variant: 'primary',
      },
      {
        label: propertiesTranslations.stats.active,
        value: activeCount.toString(),
        trend: '+8.2%',
        icon: Check,
        variant: 'success',
      },
      {
        label: propertiesTranslations.stats.pending,
        value: pendingCount.toString(),
        trend: '-3.1%',
        icon: Eye,
        variant: 'warning',
      },
      {
        label: propertiesTranslations.stats.inactive,
        value: inactiveCount.toString(),
        trend: '+5.4%',
        icon: X,
        variant: 'info',
      },
    ];
  }, [propertiesTranslations, properties]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
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
    // Refresh properties list after successful update
    try {
      const response = await get('/properties?page=1&limit=1000');
      if (response.success && response.data?.properties) {
        const transformedProperties = response.data.properties.map(prop => {
          // Map API status to filter status
          let statusDisplay = 'inactive';
          if (prop.status === 'AVAILABLE') statusDisplay = 'available';
          else if (prop.status === 'PENDING') statusDisplay = 'pending';
          else if (prop.status === 'SOLD' || prop.status === 'INACTIVE') statusDisplay = 'inactive';

          return {
            id: prop.id,
            title: prop.title,
            location: `${prop.city}, ${prop.state}`,
            price: parseFloat(prop.price),
            priceUSD: parseFloat(prop.price),
            status: statusDisplay,
            type: prop.propertyType,
            bedrooms: prop.bedrooms,
            area: prop.sqft,
            views: 0,
            partner: `${prop.owner.firstName} ${prop.owner.lastName}`,
            image: resolveImageUrl(prop.images?.[0]),
          };
        });
        setProperties(transformedProperties);
      }
    } catch (err) {
      console.error('Error refreshing properties:', err);
    }
  }, []);

  const handleDelete = useCallback(async (property) => {
    if (!confirm(`Are you sure you want to delete "${property.title}"?`)) {
      return;
    }

    try {
      const response = await del(`/properties/${property.id}`);
      if (response.success) {
        // Remove the deleted property from the list
        setProperties(prevProperties =>
          prevProperties.filter(p => p.id !== property.id)
        );
        // Reset to first page if current page becomes empty
        const newFilteredCount = filteredProperties.filter(p => p.id !== property.id).length;
        const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
    }
  }, [filteredProperties, currentPage]);

  // Pagination translations
  const paginationTranslations = useMemo(
    () => ({
      previous: t('common.previous'),
      next: t('common.next'),
      showing: t('common.showing'),
      to: t('common.to'),
      of: t('common.of'),
      results: t('common.results'),
    }),
    [t]
  );




  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className=''>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>
          {propertiesTranslations.title}
        </h1>
        <p className='text-base text-gray-600'>
          {propertiesTranslations.subtitle}
        </p>
      </div>

    

      {/* Filters */}
      <PropertiesFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        translations={propertiesTranslations}
      />

      {/* Properties Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        <PropertiesListTable
          properties={paginatedProperties}
          translations={propertiesTranslations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <ViewPropertyModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} property={selectedProperty} t={t} />
        <EditPropertyModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} property={selectedProperty} onSave={handleSaveEdit} t={t} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProperties.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          translations={paginationTranslations}
        />
      </div>
    </div>
  );
}
