"use client";
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { post } from "@/lib/api";

export default function CreateTicketModal({ show, onClose, newTicket, setNewTicket, onSubmit, editing }) {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const firstInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Admin receiver ID (constant)
  const ADMIN_RECEIVER_ID = "95994aca-2080-436a-94f1-0bc380018537";

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        firstInputRef.current?.focus?.();
      }, 0);
    }
  }, [show]);

  if (!show) return null;

  const titleId = "create-ticket-title";

  // small categories list for the new design
  const categories = ["Technical issue","Partner Complaint", "Payment Issue", "Other"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Prepare the payload
      const payload = {
        receiverId: ADMIN_RECEIVER_ID,
        subject: newTicket.subject || "",
        content: newTicket.description || ""
      };

      // Make API call
      const response = await post("/messages", payload);

      // Call the existing onSubmit handler if provided (for parent component updates)
      if (onSubmit) {
        onSubmit(response);
      }

      // Reset form and close modal on success
      setNewTicket({ subject: "", description: "" });
      onClose();
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="presentation"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200  rounded-t-2xl">
          <h2 id={titleId} className="text-lg font-semibold">
            {editing ? t("dashboard.client.supportTicket.title") : t("dashboard.client.supportTicket.createTicket")}
          </h2>
          <button onClick={onClose} aria-label="Close dialog" className="hover:bg-white/20 rounded-full p-2 transition">
            <X size={20} />
          </button>
        </div>

        {/*
          OLD MODAL FIELDS (commented out) - kept here for reference
          ------------------------------------------------------------------
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"> ... </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl"> ... </div>
          ------------------------------------------------------------------
        */}

        {/* New premium design form (uses the same `newTicket` + `setNewTicket` shape) */}
        <form onSubmit={handleFormSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className=" mb-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.client.supportTicket.createNewTicket.Subject", "Subject")}</label>
              <input
                type="text"
                ref={firstInputRef}
                value={newTicket.subject || ""}
                placeholder="Short title of your issue"
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {/* Category */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newTicket.category || categories[0]}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none bg-white/50 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.client.supportTicket.createNewTicket.Description", "Description")}</label>
            <textarea
              value={newTicket.description || ""}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder={t("dashboard.client.supportTicket.createNewTicket.DescriptionPlaceholder", "Describe your issue in detail...")}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("dashboard.client.supportTicket.createNewTicket.Cancel", "Cancel")}
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !newTicket.subject || !newTicket.description}
              className="w-full sm:w-auto px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? t("Submitting...") 
                : editing 
                  ? t("dashboard.client.supportTicket.createNewTicket.SaveChanges", "Save Changes") 
                  : t("dashboard.client.supportTicket.createNewTicket.CreateTicket", "Submit Ticket")
              }
            </button>
          </div>
        </form>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}


