"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    Heart,
    Bed,
    Bath,
    MoreVertical,
    MapPin,
    TriangleRight,
} from 'lucide-react';
// axios not needed here; parent handles API calls
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

function getStatusStyle(status) {
    switch (status) {
        case 'sold':
            return 'bg-red-50 text-red-700';
        case 'pending':
            return 'bg-yellow-50 text-yellow-700';
        case 'rented':
            return 'bg-indigo-50 text-indigo-700';
        default:
            return 'bg-green-50 text-green-700';
    }
}

export default function PropertyCard({
    property,
    onToggleLike,
    onView,
    onEdit,
    onDelete,
}) {
    const status = property.status || 'available';

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);
    const pickImage = (p) => {
        if (!p) return '/noImage.png';
        // direct fields
        if (p.image) return p.image;
        if (p.imageUrl) return p.imageUrl;
        if (p.thumbnail) return p.thumbnail;

        // common array shapes
        const tryArray = (arr) => {
            if (!arr || !arr.length) return null;
            const first = arr[0];
            if (!first) return null;
            if (typeof first === 'string') return first;
            if (first.url) return first.url;
            if (first.path) return first.path;
            if (first.src) return first.src;
            if (first.thumbnail) return first.thumbnail;
            return null;
        };

        const fromImages = tryArray(p.images || p.photos || p.media || p.gallery || p.pictures);
        if (fromImages) return fromImages;

        // sometimes API nests image under data or attributes
        if (p.data && p.data.image) return p.data.image;
        if (p.attributes && p.attributes.image) return p.attributes.image;

        return '/noImage.png';
    };

    const [imgSrc, setImgSrc] = useState(() => pickImage(property));
    const [isFavorite, setIsFavorite] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const { locale } = useLanguage();

    const routeForProperty = (p) => {
        if (!p) return 'buy';
        const candidates = [
            p.listingType,
            p.listing_type,
            p.transactionType,
            p.transaction_type,
            p.for,
            p.type,
            p.propertyType,
            p.category,
        ].filter(Boolean).map(String).join(' ').toLowerCase();

        // common indicators for rent
        if (candidates.includes('rent') || candidates.includes('rental') || candidates.includes('to-let') || candidates.includes('lease')) return 'rent';
        // common indicators for sale/buy
        if (candidates.includes('sale') || candidates.includes('buy') || candidates.includes('purchase')) return 'buy';

        // fallback: if property has a slug or url that contains '/rent/'
        const urlLike = (p.url || p.slug || p.path || '').toString().toLowerCase();
        if (urlLike.includes('/rent/') || urlLike.includes('rent')) return 'rent';

        return 'buy';
    };

    const defaultNavigateToDetails = (p) => {
        const loc = locale || (pathname && pathname.split('/')[1]) || 'en';
        const base = routeForProperty(p);
        const idOrSlug = p?.id || p?.slug || p?.uid || p?.reference || '';
        router.push(`/${loc}/${base}/${idOrSlug}`);
    };

    const defaultNavigateToBook = (id) => {
        const loc = locale || (pathname && pathname.split('/')[1]) || 'en';
        router.push(`/${loc}/book-visit?property=${id}&type=buy`);
    };

    useEffect(() => {
        function onDocClick(e) {
            if (!menuRef.current) return;
            if (menuRef.current.contains(e.target) || (btnRef.current && btnRef.current.contains(e.target))) return;
            setMenuOpen(false);
        }
        function onKey(e) {
            if (e.key === 'Escape') setMenuOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    // fetch favorite data
    // useEffect(()=>{
    //     axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties/user/favorites`)
    //     .then((res)=>console.log(res.data))
    //     .catch((err)=>console.error('Error fetching favorites', err))       
    // },[])

    return (
        <article
            className="group overflow-hidden rounded-lg bg-white/50 border border-gray-200 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${property.description || property.title || 'property'}`}
            onClick={() => defaultNavigateToDetails(property)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    defaultNavigateToDetails(property);
                }
            }}
        >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Image
                    src={imgSrc}
                    alt={property.description}
                    fill
                    onError={() => setImgSrc('/noImage.png')}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title + menu */}
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-gray-900">{property.description}</h3>
                        {property.type && (
                            <p className="mt-1 text-sm capitalize text-gray-500">{property.type}</p>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            ref={btnRef}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen((s) => !s);
                            }}
                            className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            aria-haspopup="true"
                            aria-expanded={menuOpen}
                            aria-label="More options"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>

                        {menuOpen && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <ul className="py-1">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={(ev) => { ev.stopPropagation(); setMenuOpen(false); if (onView) { onView(property.id); } else { defaultNavigateToDetails(property.id); } }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            View Details
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={(ev) => { ev.stopPropagation(); setMenuOpen(false); if (onEdit) { onEdit(property.id); } else { defaultNavigateToBook(property.id); } }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Book a Viewing
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={(ev) => { ev.stopPropagation(); setMenuOpen(false); onDelete && onDelete(property.id); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Remove from Saved
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{property.city}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <p className="text-accent font-bold text-lg">{property.price} XOF</p>
                    </div>
                </div>

                {/* Status + actions */}
                <div className="flex items-center border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => { if (onView) { onView(property.id); } else { defaultNavigateToDetails(property.id); } }}
                            className="flex items-center gap-1.5 rounded p-1.5 text-gray-400 transition-colors"
                            aria-label="View property"
                        >
                            <Bed className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { if (onEdit) { onEdit(property.id); } else { defaultNavigateToBook(property.id); } }}
                            className="flex items-center gap-1.5 rounded p-1.5 text-gray-400 transition-colors"
                            aria-label="Edit property"
                        >
                            <Bath className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { if (onDelete) { onDelete(property.id); } }}
                            className="flex items-center gap-1.5 rounded p-1.5 text-gray-400 transition-colors"
                            aria-label="Delete property"
                        >
                            <TriangleRight className="h-4 w-4" />
                            <span>{property.sqft} m²</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
