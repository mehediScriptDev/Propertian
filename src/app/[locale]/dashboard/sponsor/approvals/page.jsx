"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function SponsorApprovalsPage() {
  const [rows] = useState([
    { id: 1, title: 'Brand Awareness Q4', requester: 'Acme Inc', status: 'Pending' },
    { id: 2, title: 'Event Sponsorship - Gala', requester: 'BlueCo', status: 'Approved' },
    { id: 3, title: 'Referral Drive', requester: 'Acme Inc', status: 'Rejected' },
    { id: 4, title: 'Community Meetup', requester: 'LocalOrg', status: 'Under Review' },
  ]);

  const badgeClass = (status) =>
    status === 'Approved' ? 'bg-green-100 text-green-800' : status === 'Live' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Approvals</h1>
            <p className="mt-1 text-sm text-gray-600">View the approval status of your sponsorship and campaign requests.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Campaign</th>
                <th className="px-6 py-3 text-left">Requester</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.requester}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button aria-label={`View ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-sm text-gray-600 inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                      </button>

                      <button aria-label={`Edit ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-sm text-gray-600 inline-flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                      </button>

                      <button aria-label={`Delete ${r.title}`} className="p-1 rounded hover:bg-gray-100 text-sm text-red-600 inline-flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list (matches overview mobile card style) */}
        <div className="divide-y divide-gray-200 lg:hidden">
          {rows.map((r) => (
            <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors bg-white rounded-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{r.title}</div>
                  <div className="mt-1 text-sm text-gray-500 truncate">{r.requester}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass(r.status)}`}>{r.status}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-3">
                <button aria-label={`View ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-sm text-gray-600 inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </button>

                <button aria-label={`Edit ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-sm text-gray-600 inline-flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </button>

                <button aria-label={`Delete ${r.title}`} className="p-2 rounded hover:bg-gray-100 text-sm text-red-600 inline-flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
