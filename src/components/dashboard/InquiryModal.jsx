"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { Calendar, Copy, Mail, Phone as PhoneIcon } from "lucide-react";

export default function InquiryModal({ isOpen, onClose, inquiry }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !inquiry) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: "bg-blue-50", text: "text-blue-700", label: "New" },
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Pending",
      },
      resolved: {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Resolved",
      },
      closed: { bg: "bg-gray-50", text: "text-gray-700", label: "Closed" },
    };
    const cfg =
      statusConfig[(status || "").toString().toLowerCase()] || statusConfig.new;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const cfg = {
      high: { bg: "bg-red-50", text: "text-red-700", label: "High" },
      medium: { bg: "bg-orange-50", text: "text-orange-700", label: "Medium" },
      low: { bg: "bg-gray-50", text: "text-gray-700", label: "Low" },
    }[(priority || "").toString().toLowerCase()] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      label: "Medium",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquiry.message || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={inquiry.subject || inquiry.property || "Inquiry Details"}
      maxWidth="max-w-3xl"
      showCloseButton={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Message</h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {inquiry.message}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Copy message"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(inquiry.date).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3">
              {getPriorityBadge(inquiry.priority)}
              {getStatusBadge(inquiry.status)}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          {/* <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="font-medium text-gray-900">{inquiry.name || '—'}</div>
              {inquiry.email ? (
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-xs text-[#0A2540] hover:underline"><Mail className="w-4 h-4" />{inquiry.email}</a>
              ) : null}
              {inquiry.phone ? (
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-xs text-[#0A2540] hover:underline"><PhoneIcon className="w-4 h-4" />{inquiry.phone}</a>
              ) : null}
            </div>
          </div> */}

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Meta</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                Property:{" "}
                <span className="font-medium text-gray-900">
                  {inquiry.property || "—"}
                </span>
              </div>
              <div>
                Date:{" "}
                <span className="font-medium text-gray-900">
                  {new Date(inquiry.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                Priority:{" "}
                <span className="font-medium text-gray-900">
                  {(inquiry.priority || "medium").toString()}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 sticky bottom-0 z-10 bg-transparent pt-4">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
