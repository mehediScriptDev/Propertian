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
import axios from 'axios';

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
    const [imgSrc, setImgSrc] = useState(property.image || '/noImage.png');
    const [isFavorite, setIsFavorite] = useState([]);

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
        <article className="group overflow-hidden rounded-lg bg-white/50 border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
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
                                            onClick={(ev) => { ev.stopPropagation(); setMenuOpen(false); onView && onView(property.id); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            View Details
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={(ev) => { ev.stopPropagation(); setMenuOpen(false); onEdit && onEdit(property.id); }}
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
                            onClick={() => onView && onView(property.id)}
                            className="flex items-center gap-1.5 rounded p-1.5 text-gray-400 transition-colors"
                            aria-label="View property"
                        >
                            <Bed className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onEdit && onEdit(property.id)}
                            className="flex items-center gap-1.5 rounded p-1.5 text-gray-400 transition-colors"
                            aria-label="Edit property"
                        >
                            <Bath className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete && onDelete(property.id)}
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
