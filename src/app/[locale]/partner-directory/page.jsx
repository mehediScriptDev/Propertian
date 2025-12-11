"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import FinancialInstitutions from "@/components/partner_directory/FinancialInstitutions";
import LegalAdvisors from "@/components/partner_directory/LegalAdvisors";
import PageHeading from "@/components/partner_directory/PageHeading";
import SearchAndFilters from "@/components/partner_directory/SearchAndFilters";
import PartnerCTA from "@/components/partner_directory/PartnerCTA";
import { CiBank } from "react-icons/ci";
import { FaHome, FaPlaceOfWorship, FaCanadianMapleLeaf } from "react-icons/fa";
import { X } from "lucide-react";
import Image from "next/image";
import { get } from "@/lib/api";

// Partners will be fetched from the API instead of using hardcoded dummy data

export default function PartnerDirectoryPage() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const { user, hasRole } = useAuth();
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnerType: 'bank',
    message: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact submitted:', { partner: selectedPartner, ...formState });
    alert('Message sent successfully!');
    setFormState({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      partnerType: 'bank',
      message: '',
    });
    setIsModalOpen(false);
  };

  const handleContactPartner = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const [newPartner, setNewPartner] = useState({ name: '', category: 'Financial', website: '' });

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewPartner((s) => ({ ...s, [name]: value }));
  };

  const handleAddPartnerSubmit = (e) => {
    e.preventDefault();
    console.log('New partner (admin):', newPartner);
    // Placeholder: integrate with API to create partner
    alert('Partner added (placeholder)');
    setNewPartner({ name: '', category: 'Financial', website: '' });
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await get("/partner-directory/partners");

        // Normalize API data to the shape expected by the UI components
        const normalized = (Array.isArray(data) ? data : (data?.data || [])).map((p) => {
          const category = (p.category || "").toString();
          const normalizedCategory = category
            ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
            : "Other";

          // If API provides a logo URL, create an Image element; otherwise fallback to icons
          const logoElement = p.logo
            ? (
              <Image
                src={p.logo}
                alt={`${p.name} logo`}
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded"
              />
            )
            : normalizedCategory.toLowerCase() === "financial"
              ? <CiBank className="w-6 h-6" />
              : normalizedCategory.toLowerCase() === "legal"
                ? <FaCanadianMapleLeaf className="w-6 h-6" />
                : <FaHome className="w-6 h-6" />;

          return {
            id: p.id || p._id || p.name,
            name: p.name || "",
            description: p.description || p.shortDescription || "",
            website: p.website || "#",
            category: normalizedCategory,
            logo: logoElement,
            phone: p.phone || p.telephone || "",
            address: p.address || "",
            city: p.city || "",
            country: p.country || "",
            featured: p.featured || false,
            isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
          };
        });

        if (!mounted) return;
        setPartners(normalized);
        setFilteredPartners(normalized);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
        if (!mounted) return;
        setError(err.message || "Failed to load partners");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPartners();

    return () => {
      mounted = false;
    };
  }, []);

  // Separate filtered partners by category
  const financialPartners = useMemo(
    () => filteredPartners.filter((p) => p.category === "Financial"),
    [filteredPartners]
  );

  const legalPartners = useMemo(
    () => filteredPartners.filter((p) => p.category === "Legal"),
    [filteredPartners]
  );

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeading />
        {hasRole && hasRole('admin') && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary text-charcoal font-semibold px-4 py-2 rounded-lg hover:opacity-95"
            >
              Add Partner
            </button>
          </div>
        )}
        <SearchAndFilters
          partners={partners}
          onFilterChange={setFilteredPartners}
        />
        <FinancialInstitutions filteredPartners={financialPartners} />
        <LegalAdvisors filteredPartners={legalPartners} onContactPartner={handleContactPartner} />
        <PartnerCTA />

        {/* Contact Partner Modal */}
        {isModalOpen && selectedPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#fffff8] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#fffff8] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h3 className="text-2xl font-bold text-charcoal">
                  Contact Partner
                </h3>
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
                <p className="text-gray-600 mb-6">
                  Send a message to {selectedPartner.name}. Fill out the form below and they will get back to you soon.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formState.companyName}
                      placeholder="Enter company name here"
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Contact Person
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formState.contactPerson}
                      placeholder="Enter contact person name"
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="Enter phone or whatsApp"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="partnerType"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Partner Type
                    </label>
                    <select
                      id="partnerType"
                      name="partnerType"
                      value={formState.partnerType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                      required
                    >
                      <option value="bank">Bank/Mortgage</option>
                      <option value="legal">Legal/Notary</option>
                      <option value="developer">Developer</option>
                      <option value="agency">Agency</option>
                      <option value="relocation">Relocation/Concierge</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[14px] font-medium text-charcoal mb-1.5"
                    >
                      Message (optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formState.message}
                      placeholder="Write your short and clear message"
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-[15px] transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Admin Add Partner Modal */}
        {isAddModalOpen && hasRole && hasRole('admin') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#fffff8] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="sticky top-0 bg-[#fffff8] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h3 className="text-2xl font-bold text-charcoal">Add Partner</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close add partner modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-6">Create a new partner entry (admin only). This is a UI placeholder — integrate with API when ready.</p>

                <form onSubmit={handleAddPartnerSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-[14px] font-medium text-charcoal mb-1.5">Name</label>
                    <input id="name" name="name" value={newPartner.name} onChange={handleAddChange} required placeholder="Partner name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg" />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-[14px] font-medium text-charcoal mb-1.5">Category</label>
                    <select id="category" name="category" value={newPartner.category} onChange={handleAddChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg">
                      <option>Financial</option>
                      <option>Legal</option>
                      <option>Developer</option>
                      <option>Agency</option>
                      <option>Relocation</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-[14px] font-medium text-charcoal mb-1.5">Website</label>
                    <input id="website" name="website" value={newPartner.website} onChange={handleAddChange} placeholder="https://example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg">Create Partner</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
