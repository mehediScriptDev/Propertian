"use client"

import React from 'react'
import { X } from 'lucide-react'

export default function ConfirmModal({ open, title = 'Confirm', message = 'Are you sure?', onConfirm, onCancel }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-xl w-[min(92%,420px)] max-h-[90vh] overflow-auto z-10">
                <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-300">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <div>
                        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-2" title="Close">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-700">{message}</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
