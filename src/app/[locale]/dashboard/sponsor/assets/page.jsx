"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, File, Trash2, Eye, Image } from "lucide-react";

export default function SponsorAssetsPage() {
  const [files, setFiles] = useState([]);

  const onFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((s) => [...s, ...list.map((f) => ({ name: f.name, size: f.size }))]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Assets</h1>
            <p className="mt-1 text-sm text-gray-600">Upload logos, banners and other brand materials used for campaigns.</p>
          </div>
          <div className="flex-shrink-0">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg bg-[#E6B325] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d4a520]">
              <Upload className="h-4 w-4" />
              Upload files
              <input type="file" multiple onChange={onFiles} className="sr-only" accept="image/*,.svg" />
            </label>
          </div>
        </div>

        <div className="mt-6">
          {files.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Image className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No assets uploaded yet</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your brand assets to get started</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <ul className="divide-y divide-gray-200">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <File className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{f.name}</div>
                        <div className="text-xs text-gray-500">{(f.size / 1024).toFixed(2)} KB</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 rounded hover:bg-gray-100 text-gray-600" aria-label="Preview">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-100 text-red-600" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white/50 p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Guidelines</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-[#E6B325] mt-0.5">•</span>
            <span>Preferred formats: PNG, JPG, SVG</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#E6B325] mt-0.5">•</span>
            <span>Max size per file: 10MB</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#E6B325] mt-0.5">•</span>
            <span>Provide high-resolution assets for best results</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
