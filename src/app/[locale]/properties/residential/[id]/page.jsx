"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Download,
  Phone,
  CheckCircle,
  Shield,
  TrendingUp,
  Calendar,
  Building,
  Home,
  Waves,
  Dumbbell,
  TreePine,
  Smile,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import api from '@/lib/api';
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/i18n";

const PropertyDetailPage = () => {
  const params = useParams();
  const { locale } = useLanguage();
  const propertyId = params?.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inquiry submitted:", { property: selectedProperty, ...formState });
    alert("Thank you for your inquiry! The developer will contact you shortly.");
    setIsModalOpen(false);
  };

  const openInquire = (prefillMessage) => {
    setSelectedProperty(propertyData);
    setFormState({
      fullName: "",
      email: "",
      phone: "",
      message:
        prefillMessage || `I am interested in ${propertyData.name}. Please send me more information.`,
    });
    setIsModalOpen(true);
  };

  // Get translations
  const translations = getTranslation(locale);
  const t = (key) => {
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Fetch property data based on ID from API and normalize to UI shape
  const [propertyData, setPropertyData] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchProperty = async () => {
      setLoadingProperty(true);
      setPropertyError(null);
      try {
        const res = await api.get(`/properties/${propertyId}`, { signal: controller.signal });
        const data = res?.data || res;
        const p = data?.property || data?.data?.property || data?.data || data || null;

        if (!p) {
          if (mounted) setPropertyData(null);
          return;
        }

        // normalize images
        const image = (p.images && p.images[0]) || p.image || '/new-development/last.png';

        // normalize amenities to { icon, name }
        const amenityIconMap = {
          Pool: Waves,
          'Swimming Pool': Waves,
          Garden: TreePine,
          Parking: Building,
          Security: Shield,
          Generator: TrendingUp,
          'Fitness Center': Dumbbell,
        };
        const amenities = (p.amenities || []).map((a) => ({ icon: amenityIconMap[a] || Home, name: a }));

        // units: if API provides units use them, otherwise create one from main property
        const units = (p.units && Array.isArray(p.units) && p.units.length)
          ? p.units.map((u) => ({ name: u.name || u.title || 'Unit', size: u.size || (u.sqft ? `${u.sqft} m²` : ''), price: u.price || u.priceXOF || u.priceUSD || '', image: (u.images && u.images[0]) || u.image || image }))
          : [{ name: p.title || p.name || 'Unit', size: p.sqft ? `${p.sqft} m²` : '', price: p.price || p.priceXOF || p.priceUSD || '', image }];

        // paymentPlan: may be string, object, or array - normalize to array
        let paymentPlanArr = [];
        const rawPlan = p.paymentPlan;
        if (Array.isArray(rawPlan)) {
          paymentPlanArr = rawPlan.map((pl, idx) => (typeof pl === 'string' ? { step: idx + 1, title: '', detail: pl } : { step: pl.step ?? idx + 1, title: pl.title ?? '', detail: pl.detail ?? pl.description ?? JSON.stringify(pl) }));
        } else if (typeof rawPlan === 'string') {
          const parts = rawPlan.split(/\r?\n|,|;/).map(s => s.trim()).filter(Boolean);
          paymentPlanArr = parts.map((part, idx) => ({ step: idx + 1, title: '', detail: part }));
        } else if (rawPlan && typeof rawPlan === 'object') {
          const vals = Object.values(rawPlan).filter(Boolean);
          paymentPlanArr = vals.map((pl, idx) => (typeof pl === 'string' ? { step: idx + 1, title: '', detail: pl } : { step: pl.step ?? idx + 1, title: pl.title ?? '', detail: pl.detail ?? pl.description ?? JSON.stringify(pl) }));
        }

        const overview = {
          unitTypes: p.propertyType || p.property_type || (p.overview && (p.overview.unitTypes || p.overview.unit_type)) || '',
          startingPrice: (p.price || p.priceXOF) ? `XOF ${Number(p.price || p.priceXOF).toLocaleString()}` : '',
          completion: p.completionDate || p.completion || (p.overview && (p.overview.completion || p.overview.completionDate)) || '',
        };

        const normalized = {
          id: p.id,
          name: p.title || p.name || p.description || '',
          title: p.title || p.name || '',
          developer: p.developerName || p.developer || (p.owner ? `${p.owner.firstName || ''} ${p.owner.lastName || ''}`.trim() : ''),
          developerInfo: p.developerInfo || '',
          location: p.address || `${p.city || ''}${p.state ? ', ' + p.state : ''}` || p.location || '',
          propertyType: p.propertyType || '',
          priceXOF: p.price || p.priceXOF || '',
          priceUSD: p.priceUSD || '',
          image,
          heroImage: image,
          verified: !!p.verified,
          verifiedBy: p.verifiedBy || 'Q Homes',
          escrowEligible: !!p.escrowEligible,
          description: p.description || '',
          units,
          amenities,
          paymentPlan: paymentPlanArr,
          overview,
          investmentHighlights: (p.investmentHighlights && Array.isArray(p.investmentHighlights)) ? p.investmentHighlights : [],
          raw: p,
        };

        if (mounted) setPropertyData(normalized);
      } catch (err) {
        if (mounted) setPropertyError(err?.message || 'Failed to load property');
      } finally {
        if (mounted) setLoadingProperty(false);
      }
    };

    fetchProperty();

    return () => { mounted = false; controller.abort(); };
  }, [propertyId]);

  // Handle property not found / loading
  if (loadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading property…</div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffff7] dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {t("residentialDetails.notFound.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("residentialDetails.notFound.description")}
          </p>
          <Link
            href={`/${locale}/properties/residential`}
            className="text-[#C5A572] hover:text-[#C5A572]/80 font-medium"
          >
            {t("residentialDetails.notFound.backLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div
        className="relative min-h-[200px] sm:min-h-[480px]  bg-cover bg-center flex items-end justify-start rounded-xl overflow-hidden p-6 mb-8"
        style={{
          backgroundImage: `url('${
            propertyData.heroImage || propertyData.image
          }')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/35 to-black/35" />
        <div className=" justify-start items-start w-full">
          <div className="relative max-w-7xl mx-auto px-2 lg:px-6 h-full flex flex-col items-start sm:pb-12">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 text-center sm:text-left">
              {propertyData.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="sm:w-5 sm:h-5 h-3 w-3" />
              <p className="text-sm sm:text-base">{propertyData.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky rounded-xl top-0 z-40 mb-8 bg-background-light dark:bg-gray-800 border border-[#f6efcb] dark:border-gray-700 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-1.5 lg:py-4">
            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <div className="hidden lg:flex gap-4 xl:gap-8">
              <a
                href="#overview"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.overview")}
              </a>
              <a
                href="#units"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.units")}
              </a>
              <a
                href="#amenities"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.amenities")}
              </a>
              <a
                href="#location"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.location")}
              </a>
              <a
                href="#developer"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.developer")}
              </a>
              <a
                href="#payment"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition whitespace-nowrap"
              >
                {t("residentialDetails.navigation.payment")}
              </a>
            </div>

            {/* Mobile Menu Button - Visible on mobile/tablet only */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#C5A572] transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <>
                  <Menu className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 ml-auto lg:ml-0">
          
              <button onClick={() => openInquire()} className="px-4 sm:px-6 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#0A2540]/90 transition text-sm font-medium">
                {t("residentialDetails.buttons.inquire")}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-[#f6efcb] dark:border-gray-700 py-4 animate-fadeIn">
              <div className="flex flex-col space-y-3">
                <a
                  href="#overview"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.overview")}
                </a>
                <a
                  href="#units"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.units")}
                </a>
                <a
                  href="#amenities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.amenities")}
                </a>
                <a
                  href="#location"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.location")}
                </a>
                <a
                  href="#developer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.developer")}
                </a>
                <a
                  href="#payment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#C5A572] hover:bg-[#f6efcb] dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {t("residentialDetails.navigation.payment")}
                </a>
                <button className="sm:hidden mx-4 mt-2 px-4 py-2 bg-soft-grey dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  {t("residentialDetails.buttons.downloadBrochure")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3.5">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 lg:space-y-6 space-y-3.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#C5A572]">
                {t("residentialDetails.breadcrumb.home")}
              </Link>
              <span>/</span>
              <Link href="/new-developments" className="hover:text-[#C5A572]">
                {t("residentialDetails.breadcrumb.newDevelopments")}
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white">
                {propertyData.name}
              </span>
            </div>

            {/* Title & Badges */}
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {propertyData.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("residentialDetails.badges.by")} {propertyData.developer}
              </p>
              <div className="flex gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs lg:text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {t("residentialDetails.badges.verifiedBy")} {propertyData.verifiedBy}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs lg:text-sm font-medium">
                  <Building className="w-4 h-4" />
                  {t("residentialDetails.badges.escrowEligible")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {propertyData.description}
              </p>
            </div>

            {/* Unit Plans & Pricing */}
            <div id="units">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {t("residentialDetails.sections.unitPlans")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {propertyData.units.map((unit, index) => (
                  <div
                    key={index}
                    className="bg-white/50 dark:bg-gray-800 rounded-xl overflow-hidden border border-[#f6efcb] dark:border-gray-700 shadow-sm"
                  >
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                      <Image
                        src={unit.image}
                        alt={unit.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {unit.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {unit.size}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {unit.price}
                      </p>
                      <button className="w-full py-2.5 bg-[#0A2540] text-white rounded-lg hover:bg-[#0A2540]/90 transition">
                        {t("residentialDetails.buttons.viewPlan")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div id="amenities">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {t("residentialDetails.sections.amenities")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {propertyData.amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C5A572]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#C5A572]" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div id="location">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {t("residentialDetails.sections.locationConnectivity")}
              </h3>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                  alt={t("residentialDetails.locationMap")}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 800px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Developer Profile */}
            <div id="developer">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {t("residentialDetails.sections.developerProfile")}
              </h3>
              <div className="bg-white/50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#0A2540] flex items-center justify-center text-white font-bold text-xl">
                    Q
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {propertyData.developer}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("residentialDetails.developer.defaultDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Plans */}
            <div id="payment">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {t("residentialDetails.sections.paymentPlans")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("residentialDetails.payment.description")}
              </p>
              <div className="space-y-4">
                {propertyData.paymentPlan.map((plan) => (
                  <div
                    key={plan.step}
                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C5A572] flex items-center justify-center text-white font-bold shrink-0">
                      {plan.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {plan.detail}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 lg:space-y-6 space-y-3.5">
              {/* Development Overview */}
              <div className="bg-white/50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("residentialDetails.sidebar.developmentOverview")}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("residentialDetails.sidebar.unitTypes")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-right">
                      {propertyData.overview.unitTypes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("residentialDetails.sidebar.startingPrice")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {propertyData.overview.startingPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("residentialDetails.sidebar.estCompletion")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {propertyData.overview.completion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Investment Highlights */}
              <div className="bg-white/50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("residentialDetails.sidebar.investmentHighlights")}
                </h3>
                <div className="space-y-4">
                  {propertyData.investmentHighlights.map((highlight, index) => {
                    const Icon = highlight.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#C5A572]/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#C5A572]" />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {highlight.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => openInquire()}
                  className="w-full py-3 bg-[#0A2540] text-white rounded-lg hover:bg-[#0A2540]/90 transition font-medium"
                >
                  {t("residentialDetails.buttons.inquireAbout")}
                </button>
                <Link
                  href={`/${locale}/book-visit?property=${propertyId}&type=buy`}
                  className="w-full block text-center py-3 bg-white/50 border border-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                >
                  {t("residentialDetails.buttons.bookSiteVisit")}
                </Link>
                <button className="w-full py-3 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition font-medium flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t("residentialDetails.buttons.whatsapp")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#fffff8] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#fffff8] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">Inquire about {selectedProperty.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Fill out the form below and the developer will contact you shortly.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-[14px] font-medium text-charcoal mb-1.5">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formState.fullName}
                    placeholder='Write your full name'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[14px] font-medium text-charcoal mb-1.5">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    placeholder='Enter your email address'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[14px] font-medium text-charcoal mb-1.5">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    placeholder='Enter your phone number'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[14px] font-medium text-charcoal mb-1.5">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetailPage;
