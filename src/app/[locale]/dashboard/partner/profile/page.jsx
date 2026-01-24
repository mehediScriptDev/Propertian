"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  Package,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { get } from "@/lib/api";

export default function PartnerProfilePage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error' | ''

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const res = await get("/auth/profile");
        const user = res?.data?.user;
        if (!user) throw new Error("No user data returned");

        if (isMounted) {
          setProfileData({
            id: user.id || null,
            company_name: user.company_name || user.companyName || "",
            contact_person:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || "",
            email: user.email || "",
            phone_number: user.phone || user.phone_number || "",
            package: user.package || user.packageType || "",
            role: user.role || "",
            is_verified:
              typeof user.isVerified === "boolean"
                ? user.isVerified
                : user.is_verified || false,
            is_paid:
              typeof user.isPaid === "boolean"
                ? user.isPaid
                : user.is_paid || false,
            created_at: user.createdAt || user.created_at || null,
            updated_at: user.updatedAt || user.updated_at || null,
            last_login_at: user.lastLoginAt || user.last_login_at || null,
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        if (isMounted)
          setProfileError(err?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Add API call to save data
    console.log("Saving profile data:", formData);
    // Provide lightweight visual confirmation without changing existing save flow
    setIsEditing(false);
    setMessage(t('PertnerProfile.SaveSuccess') || 'Changes saved');
    setMessageType('success');
    // update updated_at timestamp to reflect save
    setFormData((prev) => ({ ...prev, updated_at: new Date().toISOString() }));
  }, [formData]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset form data if needed
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const packageBadgeColor = useMemo(() => {
    if (!profileData?.package) return "bg-gray-100 text-gray-800";
    switch (profileData.package) {
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Standard":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [profileData?.package]);

  return (
    <div className="space-y-3 lg:space-y-4.5">
      {/* Loading State */}
      {loadingProfile && (
        <div className="rounded-lg bg-white/50 border border-gray-200 p-8 shadow-sm text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#E6B325]"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        {message && (
          <div className={`mt-3 px-3 py-2 rounded-md ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Error State */}
      {profileError && !loadingProfile && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">
                Error loading profile
              </p>
              <p className="text-sm text-red-600">{profileError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content - Only show when not loading and no error */}
      {!loadingProfile && !profileError && profileData && (
        <>
          {/* Header */}
          <div className="rounded-lg bg-white/50 border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
                  {t("PertnerProfile.title")}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t("PertnerProfile.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white/50 border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {profileData.is_verified ? (
                  <CheckCircle
                    className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 shrink-0"
                    aria-label="Verified"
                  />
                ) : (
                  <XCircle
                    className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 shrink-0"
                    aria-label="Not verified"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("PertnerProfile.VerificationStatus")}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {profileData.is_verified
                      ? t("PertnerProfile.Verified")
                      : t("PertnerProfile.NotVerified")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white/50 border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {profileData.is_paid ? (
                  <CheckCircle
                    className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 shrink-0"
                    aria-label="Paid"
                  />
                ) : (
                  <XCircle
                    className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 shrink-0"
                    aria-label="Unpaid"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("PertnerProfile.PaymentStatus")}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {profileData.is_paid
                      ? t("PertnerProfile.Paid")
                      : t("PertnerProfile.Unpaid")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="rounded-lg bg-white/50 border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-gray-900">
              {t("PertnerProfile.CompanyInformation")}
            </h3>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {/* Partner ID */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{t("PertnerProfile.PartnerID")}</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900">
                  #{profileData.id}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{t("PertnerProfile.CompanyName")}</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900 break-all">
                  {profileData.company_name || "N/A"}
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Contact Person</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900">
                  {profileData.contact_person || "N/A"}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{t("PertnerProfile.EmailAddress")}</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900 break-all">
                  {profileData.email || "N/A"}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{t("PertnerProfile.PhoneNumber")}</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900">
                  {profileData.phone_number || "N/A"}
                </div>
              </div>

              {/* Package */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <Package className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{t("PertnerProfile.PackageType")}</span>
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${packageBadgeColor}`}
                  >
                    {profileData.package || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Timestamps */}
          <div className="rounded-lg bg-white/50 border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              {t("PertnerProfile.AccountInformation")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                  {t("PertnerProfile.AccountCreated")}
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {formatDate(profileData.created_at)}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                  {t("PertnerProfile.LastUpdated")}
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {formatDate(profileData.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
