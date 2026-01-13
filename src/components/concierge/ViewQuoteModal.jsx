"use client";

import React from "react";
import Modal from "@/components/Modal";
import { FileText, Calendar, Package } from "lucide-react";

export default function ViewQuoteModal({ isOpen, onClose, quote }) {
  if (!quote) return null;

  const getStatusBadge = (status) => {
    const styles = {
      Draft: "bg-gray-100 text-gray-700",
      Sent: "bg-blue-100 text-blue-700",
      "In Review": "bg-yellow-100 text-yellow-700",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Quote Details`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Quote #{quote.id}</h3>
              {getStatusBadge(quote.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>{quote.ticketId ? `Ticket #${quote.ticketId}` : "N/A"}</span>
              </div>
              {quote.expiryDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Expires: {quote.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-[#E6B325]">
              {quote.currency} {quote.total?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FileText className="h-4 w-4" />
            Line Items
          </h4>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {quote.items?.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description || "-"}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">{item.qty || 0}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {quote.currency} {Number(item.unit || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      {quote.currency} {(Number(item.qty || 0) * Number(item.unit || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-end gap-16 text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {quote.currency} {quote.subtotal?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-end gap-16 text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">
                {quote.currency} {quote.tax?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-end gap-16 border-t border-gray-200 pt-2 text-base">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-[#E6B325]">
                {quote.currency} {quote.total?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Notes/Message */}
        {quote.notes && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Message to Client</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
          </div>
        )}

        {/* Attachments */}
        {quote.attachments && quote.attachments.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Attachments</h4>
            <div className="space-y-2">
              {quote.attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="flex-1">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="min-w-[120px] rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
