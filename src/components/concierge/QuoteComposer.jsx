"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";

export default function QuoteComposer({ isOpen, onClose, onSend, ticket }) {
  const [items, setItems] = useState([{ description: "", qty: 1, unit: 0 }]);
  const [currency, setCurrency] = useState("USD");
  const [expiry, setExpiry] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setItems([{ description: "", qty: 1, unit: 0 }]);
      setCurrency("USD");
      setExpiry("");
      setNotes("");
      setFiles([]);
    }
  }, [isOpen]);

  const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit) || 0), 0);
  const tax = 0;
  const total = subtotal + tax;

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", qty: 1, unit: 0 }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFiles(e) {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list]);
  }

  function handleSend(status) {
    const quote = {
      id: Date.now(),
      ticketId: ticket?.id || null,
      items,
      currency,
      expiry,
      notes,
      attachments: files.map((f) => f.name),
      subtotal,
      tax,
      total,
      status,
      createdAt: new Date().toISOString(),
      author: "You"
    };
    onSend(quote);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ticket ? `Create Quote — ${ticket.clientName}` : "Create Quote"} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm py-2 px-3 text-sm">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Line Items</label>
          <div className="mt-2 space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <input value={it.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="Description" className="col-span-6 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <input type="number" value={it.qty} onChange={(e) => updateItem(idx, "qty", e.target.value)} className="col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <input type="number" value={it.unit} onChange={(e) => updateItem(idx, "unit", e.target.value)} className="col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <div className="col-span-1 text-sm">{((Number(it.qty) || 0) * (Number(it.unit) || 0)).toFixed(2)}</div>
                <button onClick={() => removeItem(idx)} className="col-span-1 text-sm text-red-600">Remove</button>
              </div>
            ))}
            <button onClick={addItem} className="mt-1 inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm">Add item</button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Attachments</label>
          <input type="file" multiple onChange={handleFiles} className="mt-2 text-sm" />
          <div className="mt-2 text-xs text-gray-600">{files.length} file(s) selected</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Expiry date</label>
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Client message</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Subtotal: <span className="font-medium">{subtotal.toFixed(2)}</span></div>
            <div className="text-sm text-gray-600">Tax: <span className="font-medium">{tax.toFixed(2)}</span></div>
            <div className="text-lg font-semibold">Total: <span className="ml-2">{total.toFixed(2)} {currency}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => handleSend("draft")} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Save Draft</button>
            <button onClick={() => handleSend("sent")} className="rounded-md bg-[#E6B325] px-4 py-2 text-sm text-white">Send Quote</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
