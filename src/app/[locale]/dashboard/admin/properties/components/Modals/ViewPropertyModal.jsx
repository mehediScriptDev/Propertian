'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

export default function ViewPropertyModal({ isOpen, onClose, property, t }) {
    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
                >
                    <X className="h-5 w-5 text-gray-700" />
                </button>

                {/* Image */}
                <div className="w-full h-64 md:h-80 relative">
                    <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover rounded-t-2xl"
                        sizes="(max-width: 768px) 100vw, 672px"
                    />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Title & Location */}
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h3>
                        <p className="text-base text-gray-600 mt-2">{property.location}</p>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price (USD)</div>
                            <div className="text-lg font-bold text-gray-900">
                                ${property.priceUSD?.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price (FCFA)</div>
                            <div className="text-lg font-bold text-gray-900">
                                {property.price?.toLocaleString()} FCFA
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</div>
                            <div className="text-lg font-semibold text-gray-900">{property.type}</div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bedrooms</div>
                            <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
