"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function SponsorAssetsPage() {
  const [files, setFiles] = useState([]);

  const onFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((s) => [...s, ...list.map((f) => ({ name: f.name, size: f.size }))]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brand Assets</h1>
            <p className="mt-1 text-sm text-gray-600">Upload logos, banners and other brand materials used for campaigns.</p>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg bg-[#E6B325] px-4 py-2 text-sm text-white">
              <Upload className="h-4 w-4" />
              Upload files
              <input type="file" multiple onChange={onFiles} className="sr-only" />
            </label>
          </div>
        </div>

        <div className="mt-6">
          {files.length === 0 ? (
            <div className="rounded-md border-2 border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No assets uploaded yet.</div>
          ) : (
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border px-4 py-2">
                  <div>
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-gray-400">{Math.round(f.size/1024)} KB</div>
                  </div>
                  <div className="text-sm text-gray-500">Preview</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold">Guidelines</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
          <li>Preferred formats: PNG, JPG, SVG</li>
          <li>Max size per file: 10MB</li>
          <li>Provide high-resolution assets for best results</li>
        </ul>
      </div>
    </div>
  );
}
