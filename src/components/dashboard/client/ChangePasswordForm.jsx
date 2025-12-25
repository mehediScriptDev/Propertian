"use client";

import { useCallback, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n";
import api from "@/lib/api";

export default function ChangePasswordForm() {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';
    const { t } = useTranslation(locale);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const idCurrent = useId();
    const idNew = useId();
    const idConfirm = useId();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!currentPassword) {
            setError(t("dashboard.client.password.errors.currentRequired"));
            return;
        }
        if (newPassword.length < 8) {
            setError(t("dashboard.client.password.errors.minLength"));
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setError(t("dashboard.client.password.errors.uppercase") || "Password must contain at least one uppercase letter");
            return;
        }
        if (!/[a-z]/.test(newPassword)) {
            setError(t("dashboard.client.password.errors.lowercase") || "Password must contain at least one lowercase letter");
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            setError(t("dashboard.client.password.errors.number") || "Password must contain at least one number");
            return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
            setError(t("dashboard.client.password.errors.special") || "Password must contain at least one special character");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t("dashboard.client.password.errors.mismatch"));
            return;
        }

        setSaving(true);
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            console.log('Change Password Response:', response.data);

            if (response.data?.success) {
                setMessage(response.data?.message || t("dashboard.client.password.updated") || "Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error('Change password failed:', err);
            setError(err.response?.data?.message || t("dashboard.client.password.errors.updateFailed") || "Failed to change password");
        } finally {
            setSaving(false);
        }
    }, [currentPassword, newPassword, confirmPassword, t]);

    return (
        <div className="rounded-lg bg-white/50 border border-gray-200 shadow-sm">
            <div className="border-b px-4 sm:px-8 border-gray-300 py-6">
                <h2 className="text-xl font-semibold text-slate-800">{t("dashboard.client.password.title")}</h2>
            </div>
            <form id="change-password-form" onSubmit={handleSubmit} className="px-4 sm:px-8 py-6">
                <div>
                    <label htmlFor={idCurrent} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.password.currentPassword")}</label>
                    <div className="relative">
                        <input
                            id={idCurrent}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current Password"
                            type={showCurrent ? "text" : "password"}
                            className="w-full rounded-md border border-slate-200 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                        >
                            {showCurrent ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <div>
                        <label htmlFor={idNew} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.password.newPassword")}</label>
                        <div className="relative">
                            <input
                                id={idNew}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type={showNew ? "text" : "password"}
                                placeholder={t("dashboard.client.password.placeholders.new")}
                                className="w-full rounded-md border border-slate-200 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                            >
                                {showNew ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor={idConfirm} className="mb-2 block text-base font-medium text-slate-700">{t("dashboard.client.password.confirmPassword")}</label>
                        <div className="relative">
                            <input
                                id={idConfirm}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type={showConfirm ? "text" : "password"}
                                placeholder={t("dashboard.client.password.placeholders.confirm")}
                                className="w-full rounded-md border border-slate-200 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                            >
                                {showConfirm ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
            </form>

            {/* full-width divider */}
            <div className="border-t border-gray-200" />

            <div className="px-4 sm:px-8 py-6 flex items-center justify-end">
                <button
                    type="submit"
                    form="change-password-form"
                    disabled={saving}
                    className="inline-flex items-center rounded-md bg-accent  px-5 py-2 text-base font-medium text-white cursor-pointer hover:text-gray-200 focus:outline-none  disabled:opacity-60"
                >
                    {saving ? t("dashboard.client.password.saving") : t("dashboard.client.password.updateButton")}
                </button>
            </div>
        </div>
    );
}
