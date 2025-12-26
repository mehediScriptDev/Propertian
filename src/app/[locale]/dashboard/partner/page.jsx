"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import dynamic from "next/dynamic";
import { get } from "@/lib/api";
import StatsCard from "@/components/dashboard/admin/StatsCard";
import Modal from '@/components/Modal';
import Link from 'next/link';
import {
  Eye,
  MapPin,
  DollarSign,
  Plus,
  MessageSquare,
  Search,
  Filter,
  Home,
  TrendingUp,
  EyeIcon,
  EyeOff,
} from "lucide-react";

// Lazy load Pagination component
const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
  ssr: false,
});

export default function PartnerDashboardPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const closeModal = () => setSelectedProperty(null);
  

  // Stats data matching admin dashboard style with SAME colors
  const [statsData, setStatsData] = useState([
    {
      title: t("Partner.statsData.totalProperties") || "Total Properties",
      value: 0,
      trend: "",
      variant: "primary",
      icon: Home,
    },
    {
      title: t("Partner.statsData.activeListings") || "Active Listings",
      value: 0,
      trend: "",
      variant: "success",
      icon: TrendingUp,
    },
    {
      title: t("Partner.statsData.inactiveListings") || "Inactive Listings",
      value: 0,
      trend: "",
      variant: "info",
      icon: Eye,
    },
    {
      title: t("Partner.statsData.totalInquiries") || "Total Inquiries",
      value: 0,
      trend: "",
      variant: "warning",
      icon: MessageSquare,
    },
  ]);

  // Fetch partner dashboard stats and inquiries count together and populate stat cards
  useEffect(() => {
    const fetchStatsAndInquiries = async () => {
      try {
        const [statsRes, inquiriesRes] = await Promise.all([
          get('/partner/dashboard/stats'),
          get('/inquiries/my-inquiries', { params: { page: 1, limit: 1 } }),
        ]);

        const statsPayload = statsRes?.data || statsRes;
        const statsRoot = statsPayload?.data || statsPayload;
        const props = statsRoot?.properties || {};

        const inquiriesPayload = inquiriesRes?.data || inquiriesRes;
        const inquiriesRoot = inquiriesPayload?.data || inquiriesPayload;
        const inquiriesTotal = inquiriesRoot?.pagination?.totalItems ?? 0;

        setStatsData([
          {
            title: t("Partner.statsData.totalProperties") || "Total Properties",
            value: props.total ?? 0,
            trend: "",
            variant: "primary",
            icon: Home,
          },
          {
            title: t("Partner.statsData.activeListings") || "Active Listings",
            value: props.active ?? 0,
            trend: "",
            variant: "success",
            icon: EyeIcon,
          },
          {
            title: t("Partner.statsData.inactiveListings") || "Inactive Listings",
            value: props.inactive ?? 0,
            trend: "",
            variant: "info",
            icon: EyeOff,
          },
          {
            title: t("Partner.statsData.totalInquiries") || "Total Inquiries",
            value: inquiriesTotal,
            trend: "",
            variant: "warning",
            icon: MessageSquare,
          },
        ]);
      } catch (err) {
        console.error('Fetch partner stats or inquiries error', err);
      }
    };

    fetchStatsAndInquiries();
  }, [locale]);

  // Fetch properties from server (server-driven pagination)
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await get('/properties/user/my-properties', { params: { page: currentPage, limit: itemsPerPage } });
        const data = res?.data || res;
        setProperties(data?.properties || []);
        setPagination(data?.pagination || { currentPage: 1, totalPages: 1, totalItems: data?.properties?.length || 0 });
      } catch (err) {
        console.error('Fetch properties error', err);
        setError('Failed to load properties');
        setProperties([]);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, itemsPerPage]);

  // Filter properties based on search and status (client-side on returned page)
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        searchQuery === "" ||
        (property.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((property.address || "") + " " + (property.city || "")).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || (property.status || "").toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, filterStatus]);

  // For rendering use filteredProperties (server already paginates)
  const currentProperties = filteredProperties;
  const totalPages = pagination?.totalPages || 1;

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3 lg:space-y-4.5">
      {/* Welcome Section */}
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {t("Partner.welcome")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{t("Partner.title")}</p>
          </div>
          <Link href={`/${locale}/dashboard/partner/properties/add`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none focus:ring-offset-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("Partner.addButton")}
          </Link>
        </div>
      </div>

      {/* Stats Grid - Using Admin StatsCard component */}
      <div className="grid gap-3 lg:gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            variant={stat.variant}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Recent Properties */}
      <div className="rounded-xl bg-white/50 shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("dashboard.partner.AllProperties")}
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder={t("Partner.SearchInquiries")}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                  aria-label="Search inquiries"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <Filter
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto"
                  aria-label="Filter by status"
                >
                  <option value="all">{t("Partner.AllStatus")}</option>
                  <option value="active">{t("Partner.Active")}</option>
                  <option value="pending">{t("Partner.Pending")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("Partner.Properties")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("Partner.Locations")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("Partner.Price")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("Partner.Status")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  {t("Partner.Actions") || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentProperties.map((property) => (
                <tr
                  key={property.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {property.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {(property.address || "") + (property.city ? ", " + property.city : "")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      {property.price}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(property.status || "").toLowerCase() === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {(property.status || "").charAt(0).toUpperCase() + (property.status || "").slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedProperty(property)} className="text-sm font-medium text-[#E6B325] hover:underline">
                      {t("Partner.ViewDetails") || 'View details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-gray-200 lg:hidden">
          {currentProperties.map((property) => (
            <div
              key={property.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">{property.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {(property.address || "") + (property.city ? ", " + property.city : "")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                  <span className="font-medium">{property.price}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                  {property.views} views
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${property.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {property.status === "active" ? "Active" : "Pending"}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                  {property._count?.inquiries ?? '-'} {t("Partner.inquiries")}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <button onClick={() => setSelectedProperty(property)} className="text-sm font-medium text-[#E6B325] hover:underline">
                  {t("Partner.ViewDetails") || 'View details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentProperties.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-300">
              <MapPin className="h-12 w-12" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-900">
              {t("Partner.NoPropertiesFound")}
            </h3>
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={pagination?.totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            translations={{
              showing: t("Partner.Showing"),
              to: t("Partner.to"),
              of: 'out of',
              results: t("Partner.results"),
              previous: t("Partner.Previous"),
              next: t("Partner.Next"),
            }}
          />
        )}
        {/* Property Details Modal (uses shared Modal component for consistent styling) */}
        <Modal
          isOpen={!!selectedProperty}
          onClose={closeModal}
          title={selectedProperty?.title}
          maxWidth="max-w-3xl"
          showCloseButton={false}
          footer={selectedProperty && (
            <div className="flex items-center justify-end gap-3">
              <button onClick={closeModal} className="rounded-md border border-gray-200 px-4 py-2 text-sm bg-white">{t('common.close') || 'Close'}</button>
            </div>
          )}
        >
          {selectedProperty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <img src={selectedProperty.images[0]} alt={selectedProperty.title} className="w-full h-56 md:h-64 object-cover rounded" />
                ) : (
                  <div className="w-full h-56 md:h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">{t('Partner.noImage') || 'No image'}</div>
                )}
              </div>
              <div className="text-sm text-gray-700">
                <p className="text-gray-800 mb-3">{selectedProperty.description}</p>
                <div className="space-y-2">
                  <div><strong>{t('Partner.Address') || 'Address'}:</strong> {(selectedProperty.address || '') + (selectedProperty.city ? ', ' + selectedProperty.city : '')}</div>
                  <div><strong>{t('Partner.Price') || 'Price'}:</strong> {selectedProperty.price}</div>
                  <div className="flex gap-4">
                    <div><strong>{t('Partner.Bedrooms') || 'Bedrooms'}:</strong> {selectedProperty.bedrooms ?? '-'}</div>
                    <div><strong>{t('Partner.Bathrooms') || 'Bathrooms'}:</strong> {selectedProperty.bathrooms ?? '-'}</div>
                    <div><strong>{t('Partner.Sqft') || 'Sqft'}:</strong> {selectedProperty.sqft ?? '-'}</div>
                  </div>
                  <div>
                    <strong>{t('Partner.Amenities') || 'Amenities'}:</strong>
                    <ul className="list-disc ml-5 mt-1 text-sm">
                      {(selectedProperty.amenities || []).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
        {/* AddPropertyModal removed - partner uses full page add flow now */}
      </div>
    </div>
  );
}
