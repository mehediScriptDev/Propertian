"use client";

import Link from "next/link";
import { useState } from "react";
import { Upload, Calendar, DollarSign } from "lucide-react";

export default function SponsorSubmitPage() {
  const [form, setForm] = useState({ title: "", start: "", end: "", budget: "", description: "" });

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Submit Sponsorship / Event Campaign</h1>
            <p className="mt-1 text-sm text-gray-600">Provide campaign details. Submissions are subject to admin approval.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-700">Campaign Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Budget (USD)</label>
            <div className="mt-1 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <input name="budget" value={form.budget} onChange={handleChange} className="block w-full rounded-md border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Start Date</label>
            <input type="date" name="start" value={form.start} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">End Date</label>
            <input type="date" name="end" value={form.end} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" rows={5} />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Brand Assets</label>
            <div className="mt-1 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm">
                <Upload className="h-4 w-4" />
                Upload assets
                <input type="file" className="sr-only" multiple />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-400">You can also manage assets from the Assets page.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link href=".." className="px-4 py-2 rounded border">Cancel</Link>
          <button disabled className="px-4 py-2 rounded bg-[#E6B325] text-white">Submit for Approval</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="mt-2 text-sm text-gray-600">All submissions are reviewed by admins. You will receive a notification once a decision is made.</p>
      </div>
    </div>
  );
}
