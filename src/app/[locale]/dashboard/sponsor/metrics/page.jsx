"use client";

import { useState } from "react";
import { BarChart, Eye } from "lucide-react";

export default function SponsorMetricsPage() {
  const [campaigns] = useState([
    { id: 1, title: 'Q4 Awareness', views: 12000, clicks: 450, regs: 34 },
    { id: 2, title: 'Holiday Promo', views: 8300, clicks: 210, regs: 12 },
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaign Performance</h1>
            <p className="mt-1 text-sm text-gray-600">Overview of views, clicks and registrations per campaign.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-400">Summary metrics</div>
                </div>
                <div className="text-sm text-gray-600">Views: {c.views}</div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-4">
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <div className="text-xs text-gray-500">Clicks</div>
                  <div className="text-lg font-semibold">{c.clicks}</div>
                </div>
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <div className="text-xs text-gray-500">Registrations</div>
                  <div className="text-lg font-semibold">{c.regs}</div>
                </div>
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <div className="text-xs text-gray-500">CTR</div>
                  <div className="text-lg font-semibold">{((c.clicks / c.views) * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
