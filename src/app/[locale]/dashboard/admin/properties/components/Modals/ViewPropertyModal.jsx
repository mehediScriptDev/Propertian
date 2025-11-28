'use client';

import Image from 'next/image';
import { X, MapPin, DollarSign, Home, Bed, Maximize2, User } from 'lucide-react';
import { useEffect } from 'react';

export default function ViewPropertyModal({ isOpen, onClose, property, t }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen || !property) return null;

    // Status badge styling
    const getStatusBadge = (status) => {
        const styles = {
            available: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            inactive: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        const labels = {
            available: 'Available',
            pending: 'Pending',
            inactive: 'Inactive',
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.inactive}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                >
                    <X className="h-5 w-5 text-gray-700" />
                </button>

                {/* Scrollable content */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Hero Image with Overlay Info */}
                    <div className="relative w-full h-80 md:h-96">
                        <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 896px"
                            priority
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Overlay content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                                        {property.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <MapPin className="h-5 w-5 shrink-0" />
                                        <span className="text-lg">{property.location}</span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {getStatusBadge(property.status)}
                                </div>
                            </div>

                            {/* Price badges */}
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-[#d4af37]" />
                                        <div>
                                            <div className="text-xs text-gray-600 font-medium">Price USD</div>
                                            <div className="text-lg font-bold text-gray-900">
                                                ${property.priceUSD?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-[#d4af37]" />
                                        <div>
                                            <div className="text-xs text-gray-600 font-medium">Price FCFA</div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {property.price?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 md:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Property Details</h3>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Type */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Home className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-0.5">Type</div>
                                        <div className="text-base font-bold text-gray-900">{property.type || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Bed className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-0.5">Bedrooms</div>
                                        <div className="text-base font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Area */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Maximize2 className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 mb-0.5">Area</div>
                                        <div className="text-base font-bold text-gray-900">{property.area ? `${property.area} sqft` : 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Views removed as requested */}
                        </div>

                        {/* Partner Info */}
                        {property.partner && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="p-3 bg-[#d4af37] rounded-full">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-600">Listed by</div>
                                        <div className="text-lg font-bold text-gray-900">{property.partner}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
