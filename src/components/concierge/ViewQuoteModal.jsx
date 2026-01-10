"use client";

import React from "react";
import Modal from "@/components/Modal";

export default function ViewQuoteModal({ isOpen, onClose, quote }) {
  if (!quote) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Quote #${quote.id}`} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-sm font-medium">{quote.status}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-semibold">{quote.total.toFixed(2)} {quote.currency}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Items</h4>
          <div className="mt-2 space-y-2 text-sm text-gray-700">
            {quote.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <div>{it.description || "-"}</div>
                <div>{it.qty} × {Number(it.unit).toFixed(2)} = {(Number(it.qty) * Number(it.unit)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {quote.attachments && quote.attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Attachments</h4>
            <ul className="mt-2 text-sm text-gray-600">
              {quote.attachments.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-sm text-gray-600">Message: {quote.notes}</div>

        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Close</button>
        </div>
      </div>
    </Modal>
  );
}
