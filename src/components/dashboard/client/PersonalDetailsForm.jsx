"use client";

import { useTranslation } from "@/i18n";
import { usePathname } from "next/navigation";
import { useCallback, useId, useState, useEffect, useRef } from "react";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import authService from '@/services/authService';
import SuccessModal from '@/components/ui/SuccessModal';

export default function PersonalDetailsForm() {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';
    const { t } = useTranslation(locale);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const messageTimerRef = useRef(null);

    const idFirst = useId();
    const idLast = useId();
    const idEmail = useId();
    const idPhone = useId();

    const { user, updateUserData } = useAuth();

    // Fetch user profile from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/auth/profile');
                console.log('Profile API Response:', response);
                if (response?.success && response?.data?.user) {
                    const userData = response.data.user;
                    setFirstName(userData.firstName || '');
                    setLastName(userData.lastName || '');
                    setEmail(userData.email || '');
                    setPhone(userData.phone || '');
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setMessage('Failed to load profile data');
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Fallback: Populate fields from user context if API hasn't loaded yet
    useEffect(() => {
        // Only populate the form when the field is still `null` (untouched)
        if (user && firstName === null && !loading) {
            if (user.firstName) setFirstName(user.firstName);
            if (user.lastName) setLastName(user.lastName);
            if (user.email) setEmail(user.email);
            if (user.phone) setPhone(user.phone);
        }
    }, [user, firstName, loading]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("info");

        // Basic client-side validation
        if (!firstName || !lastName) {
            setMessage("First name and last name are required");
            setMessageType("error");
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage(t("dashboard.client.personalDetails.errors.emailInvalid"));
            setMessageType("error");
            return;
        }

        setSaving(true);
        try {
            // Update profile via API
            const response = await api.put('/auth/profile', {
                firstName,
                lastName,
                phone
            });

            console.log('Profile Update Response:', response);

            // response is backend body (api wrapper returns response.data)
            if (response?.success) {
                // open centered success modal instead of toast
                const msg = t("dashboard.client.personalDetails.saved") || "Profile updated successfully!";
                setSuccessMessage(msg);
                setSuccessModalOpen(true);

                // Normalize backend user object
                const backendUser = response?.data?.user || response?.user || response;
                if (backendUser) {
                    setFirstName(backendUser.firstName || firstName);
                    setLastName(backendUser.lastName || lastName);
                    setEmail(backendUser.email || email);
                    setPhone(backendUser.phone || phone);

                    // Propagate avatar and name changes to global auth state so header/profile updates
                    try {
                        // fetch latest profile from backend to be safe
                        const fresh = await authService.getCurrentUser();
                        const profile = fresh?.data?.user || fresh?.user || fresh;
                        const avatar = profile?.avatar || profile?.profileImage || profile?.image || backendUser.avatar || null;
                        const first = profile?.firstName || backendUser.firstName || firstName;
                        const last = profile?.lastName || backendUser.lastName || lastName;
                        const fullName = `${first} ${last}`.trim();
                        updateUserData({ firstName: first, lastName: last, fullName, avatar });
                    } catch (err) {
                        console.error('Failed to update auth context:', err);
                    }
                }
            }
        } catch (err) {
            console.error('Profile update failed:', err);
            const errMsg = err.response?.data?.message || t("dashboard.client.personalDetails.errors.saveFailed") || "Failed to update profile";
            setMessage(errMsg);
            setMessageType("error");
        } finally {
            setSaving(false);
        }
    }, [firstName, lastName, email, phone, t]);

    // cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (messageTimerRef.current) {
                clearTimeout(messageTimerRef.current);
                messageTimerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="rounded-lg bg-white/50 border border-gray-200 shadow-sm">
            <div className="border-b border-gray-300 px-4 sm:px-8 py-4">
                <h2 className="text-2xl font-semibold text-slate-800">{t("dashboard.client.personalDetails.title")}</h2>
            </div>

            {loading ? (
                <div className="px-4 sm:px-8 py-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                    <p className="mt-4 text-slate-600">Loading profile...</p>
                </div>
            ) : (
                <>
                    <form id="personal-details-form" onSubmit={handleSubmit} className="px-4 sm:px-8 py-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            <div>
                                <label htmlFor={idFirst} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.firstName")}</label>

                                <SuccessModal
                                    open={successModalOpen}
                                    title={t("dashboard.client.personalDetails.saved") || 'Saved'}
                                    message={successMessage}
                                    onClose={() => setSuccessModalOpen(false)}
                                />
                                <input
                                    id={idFirst}
                                    value={firstName ?? ''}
                                    onChange={(e) => { setFirstName(e.target.value); setMessage(''); setMessageType('info'); }}
                                    type="text"
                                    className="w-full rounded-md border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                />
                            </div>

                            <div>
                                <label htmlFor={idLast} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.lastName")}</label>
                                <input
                                    id={idLast}
                                    value={lastName ?? ''}
                                    onChange={(e) => { setLastName(e.target.value); setMessage(''); setMessageType('info'); }}
                                    type="text"
                                    className="w-full rounded-md border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor={idEmail} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.email")}</label>
                            <input
                                id={idEmail}
                                value={email ?? ''}
                                onChange={(e) => { setEmail(e.target.value); setMessage(''); setMessageType('info'); }}
                                type="email"
                                aria-invalid={messageType === 'error'}
                                className="w-full rounded-md border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                        </div>

                        <div className="mt-6">
                            <label htmlFor={idPhone} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.phone")}</label>
                            <input
                                id={idPhone}
                                value={phone ?? ''}
                                onChange={(e) => { setPhone(e.target.value); setMessage(''); setMessageType('info'); }}
                                type="text"
                                className="w-full rounded-md border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                        </div>

                        {/* inline messages removed — success uses toast; show inline only for errors */}
                        {messageType === 'error' && message && (
                            <p className='mt-4 text-sm text-red-600'>{message}</p>
                        )}
                    </form>

                    {/* full-width divider that touches card edges */}
                    <div className="border-t border-gray-200" />

                    <div className="px-4 sm:px-8 py-6 flex items-center justify-end">
                        <button
                            type="submit"
                            form="personal-details-form"
                            disabled={saving}
                            className="inline-flex items-center rounded-md bg-accent px-5 py-2 text-base font-medium text-white hover:text-gray-200 cursor-pointer focus:outline-none  disabled:opacity-60"
                        >
                            {saving ? t("dashboard.client.personalDetails.saving") : t("dashboard.client.personalDetails.saveButton")}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
