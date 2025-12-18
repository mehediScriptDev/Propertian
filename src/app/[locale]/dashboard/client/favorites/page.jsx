"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertyCard from '@/components/dashboard/client/PropertyCard';
import { useTranslation } from '@/i18n';
import api from '@/lib/api';

export default function SavedProperties() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [favProperties, setFavProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // get all favourite properties
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchFavs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/properties/user/favorites', { signal: controller.signal });

        // `api.get` returns the parsed response data. Different backends use different shapes.
        // Handle common shapes: { data: { properties: [...] } }, { properties: [...] }, { data: [...] }
        const data = res?.data || res;
        let properties = data?.properties || data?.data?.properties || data?.favorites || data?.items || data || [];

        // If properties is an object with nested fields, try to normalize to an array
        if (!Array.isArray(properties) && typeof properties === 'object') {
          properties = Object.values(properties);
        }

        if (mounted) setFavProperties(properties || []);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load favorites');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFavs();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const toggleLike = useCallback((id) => {
    setFavProperties((prev) => prev.map((prop) => (prop.id === id ? { ...prop, liked: !prop.liked } : prop)));
  }, []);

  
  const removeFavorite = useCallback(async (propertyId) => {
    try {
     
      await api.delete(`/properties/${propertyId}/favorite`);
      
      setFavProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error('Failed to remove favorite', err);
      
      setError(err?.message || 'Failed to remove favorite');
    }
  }, []);

  // Toolbar search state
  const [search, setSearch] = useState('');

  const filteredProperties = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return favProperties;
    return favProperties.filter((p) =>
      String(p.title || p.name || '').toLowerCase().includes(q) ||
      String(p.address || p.location || '').toLowerCase().includes(q) ||
      String(p.price || '').toLowerCase().includes(q)
    );
  }, [favProperties, search]);

  return (
    <div className="min-h-screen  space-y-6">
      <div>
        {/* Header */}

        <div className="bg-white/50 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 mb-3 lg:mb-4.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">{t('dashboard.pages.savedProperties.title')}</h1>
          <p className="text-sm sm:text-base text-black/80">{t('dashboard.pages.savedProperties.subtitle')}</p>
        </div>
        {/* Toolbar (search, status select, add) - matches provided image */}
        <div className="bg-white/50 border border-gray-200 rounded-lg px-4 py-3 lg:py-6 mb-3 lg:mb-4.5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-full">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('dashboard.client.searchProperties')}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 lg:py-3 pl-10 text-sm lg:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div
          className="grid lg:gap-4.5 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="region"
          aria-label={t('dashboard.pages.savedProperties.propertiesRegion')}
        >
          {loading ? (
            <div className="col-span-full p-6 text-center">Loading saved properties…</div>
          ) : error ? (
            <div className="col-span-full p-6 text-center text-red-600">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full p-6 text-center">{t('dashboard.pages.savedProperties.noSaved') || 'No saved properties yet'}</div>
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} onToggleLike={toggleLike} onDelete={removeFavorite} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
