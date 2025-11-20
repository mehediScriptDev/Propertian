"use client";

import React, { useState, useMemo } from "react";
import FinancialInstitutions from "@/components/partner_directory/FinancialInstitutions";
import LegalAdvisors from "@/components/partner_directory/LegalAdvisors";
import PageHeading from "@/components/partner_directory/PageHeading";
import SearchAndFilters from "@/components/partner_directory/SearchAndFilters";
import PartnerCTA from "@/components/partner_directory/PartnerCTA";
import { CiBank } from "react-icons/ci";
import { FaHome, FaPlaceOfWorship, FaCanadianMapleLeaf } from "react-icons/fa";
import { X } from "lucide-react";

// Combined partners data with category tags
const allPartnersData = [
  // Financial Institutions
  {
    name: "FinBank CI",
    description:
      "Your trusted partner for mortgage solutions and real estate financing in Côte d'Ivoire. Tailored loans for every home buyer.",
    logo: <CiBank className="w-6 h-6" />,
    website: "#",
    category: "Financial",
  },
  {
    name: "Prestige Mortgages",
    description:
      "Specializing in premium mortgage services for luxury properties. We provide expert financial guidance for your high-value investments.",
    logo: <FaHome className="w-6 h-6" />,
    website: "#",
    category: "Financial",
  },
  {
    name: "Abidjan Credit Union",
    description:
      "Community-focused banking offering competitive home loans and financial planning services for families and individuals.",
    logo: <FaPlaceOfWorship className="w-6 h-6" />,
    website: "#",
    category: "Financial",
  },
  // Legal Advisors
  {
    name: "Legis Ivoire",
    description:
      "Expert legal counsel for all your real estate transactions. We ensure every contract is secure and every title is clear.",
    logo: <FaCanadianMapleLeaf className="w-6 h-6" />,
    website: "#",
    category: "Legal",
  },
];

export default function PartnerDirectoryPage() {
  const [filteredPartners, setFilteredPartners] = useState(allPartnersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnerType: 'bank',
    message: '',
  });

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
        <SearchAndFilters
          partners={allPartnersData}
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
      </div>
    </main>
  );
}
