'use client';

import Modal from '@/components/Modal';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function ViewPropertyModal({ isOpen, onClose, property, t }) {
    if (!property) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t?.('dashboard.admin.properties.view') || 'View Property'}
            maxWidth="max-w-xl"
        >
            <div className="relative space-y-5 px-4 py-4">

                    {/* Close button placed slightly outside the image/modal top-right (red-mark) */}
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        title="Close"
                        className="absolute -top-3 -right-3 z-50 p-1.5 rounded-sm "
                    >
                        <X className="h-6 w-6 " />
                    </button>
                {/* Image (centered) with close icon overlay */}
                <div className="w-full mx-auto rounded-lg overflow-hidden relative" style={{ maxWidth: 920 }}>
                    <div className="w-full h-56 relative">
                        <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    </div>

                </div>

                {/* Title & Location */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{property.location}</p>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <div className="text-xs text-gray-500">Price (USD)</div>
                        <div className="font-medium">
                            ${property.priceUSD?.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Price (FCFA)</div>
                        <div className="font-medium">
                            {property.price?.toLocaleString()} FCFA
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Type</div>
                        <div className="font-medium">{property.type}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Bedrooms</div>
                        <div className="font-medium">{property.bedrooms}</div>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
