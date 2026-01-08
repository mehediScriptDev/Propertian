"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function SponsorApprovalsPage() {
  const [rows] = useState([
    { id: 1, title: 'Brand Awareness Q4', requester: 'Acme Inc', status: 'Pending' },
    { id: 2, title: 'Event Sponsorship - Gala', requester: 'BlueCo', status: 'Approved' },
    { id: 3, title: 'Referral Drive', requester: 'Acme Inc', status: 'Live' },
  ]);

  const badgeClass = (status) =>
    status === 'Approved' ? 'bg-green-100 text-green-800' : status === 'Live' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Approvals</h1>
            <p className="mt-1 text-sm text-gray-600">View the approval status of your sponsorship and campaign requests.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                <th className="py-2">Campaign</th>
                <th className="py-2">Requester</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="py-3 text-sm text-gray-600">{r.requester}</td>
                  <td className="py-3"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span></td>
                  <td className="py-3 text-right">
                    <Link href="#" className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
