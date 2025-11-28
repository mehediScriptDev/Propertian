"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PropertyCard from '@/components/dashboard/client/PropertyCard';
import { useTranslation } from '@/i18n';
import axios from 'axios';
import api from '@/lib/api';

export default function SavedProperties() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [favProperties, setFavProperties] = useState([]);
  console.log(favProperties);
  

  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      name: 'Villa de Luxe',
      location: 'Cocody, Abidjan',
      price: '150,000,000',
      beds: 4,
      baths: 5,
      area: 350,
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop',
      liked: false,
    },
    {
      id: 2,
      name: 'Appartement Moderne',
      location: 'Plateau, Abidjan',
      price: '85,000,000',
      beds: 2,
      baths: 2,
      area: 120,
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=350&fit=crop',
      liked: false,
    },
    {
      id: 3,
      name: 'Maison Familiale',
      location: 'Riviera Palmeroie, Abidjan',
      price: '120,000,000',
      beds: 5,
      baths: 4,
      area: 400,
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop',
      liked: false,
    },
    {
      id: 4,
      name: 'Maison Familiale',
      location: 'Riviera Palmeroie, Abidjan',
      price: '120,000,000',
      beds: 5,
      baths: 4,
      area: 400,
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop',
      liked: false,
    },
  ]);
  // get all favourite property
  useEffect(()=>{
    api.get('/properties/user/favorites')
    .then(res=>setFavProperties(res.data.properties)
    )
    .catch(err=>console.log(err)
    )
  },[])

  const toggleLike = useCallback((id) => {
    setSavedProperties((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, liked: !prop.liked } : prop))
    );
  }, []);

  // Toolbar search state
  const [search, setSearch] = useState('');

  const filteredProperties = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return savedProperties;
    return savedProperties.filter((p) =>
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.location || '').toLowerCase().includes(q) ||
      String(p.price || '').toLowerCase().includes(q)
    );
  }, [savedProperties, search]);

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

            {/* <div className="ml-auto flex items-center gap-3">

              <button
                type="button"
                aria-label={t('dashboard.actions.addProperty') || 'Add Property'}
                className="bg-[#E6B325] text-white px-4 py-2 rounded shadow text-base flex items-center"
              // TODO: wire add property action
              >
                <Plus className="h-6 text-white w-6 mr-2" aria-hidden="true" />
                <span>{t('dashboard.client.addProperty')}</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Properties Grid */}
        <div
          className="grid lg:gap-4.5 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="region"
          aria-label={t('dashboard.pages.savedProperties.propertiesRegion')}
        >
          {favProperties.map((property) => (
            <PropertyCard key={property.id} property={property} onToggleLike={toggleLike} />
          ))}
        </div>
      </div>
    </div>
  );
}
