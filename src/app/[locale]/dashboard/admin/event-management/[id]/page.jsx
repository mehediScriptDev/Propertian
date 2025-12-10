"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import axios from '@/lib/axios'
import RegistrationTable from '../components/RegistrationTable'

function fetchEventClient(id) {
    return axios
        .get(`/events/${id}`)
        .then((res) => {
            if (!res || !res.data) return null;
            // Some backend responses wrap payload as { success: true, data: { ... } }
            if (typeof res.data === 'object' && res.data.data) return res.data.data;
            return res.data;
        })
        .catch(() => null);
}

function fetchEventRegistrations(eventId) {
    return axios
        .get(`/events/${eventId}/registrations?page=1&limit=50`)
        .then((res) => {
            if (!res || !res.data) return [];
            // Handle { success, data } envelope
            if (typeof res.data === 'object' && res.data.data) return res.data.data;
            return res.data;
        })
        .catch(() => []);
}

const fallbackEvent = {
    id: '',
    title: 'Event Details',
    description: '',
    eventDate: null,
    endDate: null,
    location: '',
    address: '',
    city: '',
    country: '',
    capacity: null,
    image: null,
    status: 'DRAFT',
    eventType: '',
    isPublished: false,
    createdAt: null,
    updatedAt: null,
    speakers: [],
    learningPoints: [],
    _count: { registrations: 0 }
};

const formatDate = (d) => {
    if (!d) return '-';
    try {
        return new Date(d).toLocaleString();
    } catch (e) {
        return d;
    }
}

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    // Derive routeId synchronously from URL path as fallback
    const routeId = id || (typeof window !== 'undefined'
        ? window.location.pathname.split('/').pop()
        : null);

    // initialize state from sessionStorage synchronously to avoid extra renders
    const [event, setEvent] = useState(() => {
        try {
            if (typeof window !== 'undefined' && routeId) {
                const key = `event_${routeId}`;
                const stored = sessionStorage.getItem(key);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // remove cached copy to avoid stale reads next time
                    try { sessionStorage.removeItem(key); } catch (e) { }
                    return parsed;
                }
            }
        } catch (e) {
            // ignore
        }

        // if no routeId provided, show fallback immediately
        if (!routeId) return fallbackEvent;
        return null;
    });

    const [loading, setLoading] = useState(() => {
        // if we already initialized event from sessionStorage or no routeId, not loading
        if (!routeId) return false;
        try {
            if (typeof window !== 'undefined') {
                const key = `event_${routeId}`;
                const stored = sessionStorage.getItem(key);
                if (stored) return false;
            }
        } catch (e) { }
        return true;
    });

    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(true);

    useEffect(() => {
        let mounted = true;

        // if no routeId, nothing to fetch
        if (!routeId) {
            setLoading(false);
            return;
        }

        // if we already have event with an id (from sessionStorage) skip fetching
        if (event && event.id) {
            setLoading(false);
            return;
        }

        // Start fetching
        setLoading(true);
        fetchEventClient(routeId).then((data) => {
            if (mounted) {
                setEvent(data || fallbackEvent);
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setEvent(fallbackEvent);
                setLoading(false);
            }
        });

        return () => { mounted = false; };
    }, [routeId]);

    useEffect(() => {
        let mounted = true;

        if (!routeId) {
            setLoadingRegistrations(false);
            return;
        }

        setLoadingRegistrations(true);
        fetchEventRegistrations(routeId).then((data) => {
            if (mounted) {
                setRegistrations(Array.isArray(data) ? data : []);
                setLoadingRegistrations(false);
            }
        }).catch(() => {
            if (mounted) {
                setRegistrations([]);
                setLoadingRegistrations(false);
            }
        });

        return () => { mounted = false; };
    }, [routeId]);

    if (loading) return <div className="p-6">Loading event…</div>;

    return (
        <div className=" space-y-6">
            <div>
                <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2" onClick={() => router.back()}>
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>
            <div className=" ">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
                        <p className="text-base text-gray-500 mt-1">ID: <span className="font-mono">{event.id}</span></p>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-base font-medium bg-blue-100 text-blue-800">{event.status}</span>
                        <div className="text-base text-gray-600 mt-2">{event.eventType}</div>
                        <div className="text-base text-gray-600">{event.isPublished ? 'Published' : 'Draft'}</div>
                    </div>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-base font-semibold text-gray-700">When</h3>
                        <p className="text-base text-gray-800">Start: {formatDate(event.eventDate)}</p>
                        <p className="text-base text-gray-800">End: {formatDate(event.endDate)}</p>

                        <h3 className="text-base font-semibold text-gray-700 mt-4">Where</h3>
                        <p className="text-base text-gray-800">{event.location}</p>
                        <p className="text-base text-gray-600">{event.address}</p>
                        <p className="text-base text-gray-600">{event.city} — {event.country}</p>

                        <h3 className="text-base font-semibold text-gray-700 mt-4">Capacity</h3>
                        <p className="text-base text-gray-800">{event.capacity ?? '-'}</p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-700">Summary</h3>
                        <p className="text-base text-gray-800 mt-1">{event.description}</p>

                        <h3 className="text-base font-semibold text-gray-700 mt-4">Meta</h3>
                        <ul className="text-base text-gray-600 mt-1 space-y-1">
                            <li>Created: {formatDate(event.createdAt)}</li>
                            <li>Updated: {formatDate(event.updatedAt)}</li>
                            <li>Registrations: {event._count?.registrations ?? 0}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800">Speakers</h3>
                    <div className="mt-3 space-y-3">
                        {Array.isArray(event.speakers) && event.speakers.length > 0 ? (
                            event.speakers.map((s) => (
                                <div key={s.id} className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-medium text-gray-900">{s.name}</div>
                                            <div className="text-base text-gray-600">{s.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-base text-gray-700 mt-2">{s.bio}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-base text-gray-600">No speakers listed.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Learning Points</h3>
                    <ul className="list-disc list-inside mt-3 text-base text-gray-700 space-y-1">
                        {Array.isArray(event.learningPoints) && event.learningPoints.length > 0 ? (
                            event.learningPoints.map((lp) => <li key={lp.id}>{lp.point}</li>)
                        ) : (
                            <li>None listed.</li>
                        )}
                    </ul>
                </div>

                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">All Registrations</h3>
                    <RegistrationTable
                        registrations={registrations}
                        loading={loadingRegistrations}
                    />
                </div>
            </div>
        </div>
    )
}

export default Page