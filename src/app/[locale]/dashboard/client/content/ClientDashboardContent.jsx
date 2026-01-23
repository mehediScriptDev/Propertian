"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import ChangePasswordForm from "@/components/dashboard/client/ChangePasswordForm";
import PersonalDetailsForm from "@/components/dashboard/client/PersonalDetailsForm";
import { useState } from "react";

export default function ClientDashboardContent() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { t } = useTranslation(locale);
  const router = useRouter();

  const goTo2FA = () => {
    router.push(`/${locale}/auth/2fa`);
  };

  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="space-y-3 lg:space-y-4.5">
      {/* Page header */}
      <header className="bg-white/50 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          {t("dashboard.client.profile")}
        </h1>
        <p className="text-sm sm:text-base text-black/80">
          {t("dashboard.client.subtitle")}
        </p>
      </header>

      {/* Components: personal details and change password (client-side) */}
      <div className="space-y-3 lg:space-y-4.5">
        <PersonalDetailsForm />

        <div className="rounded-lg bg-white/50 border border-gray-200 shadow-sm px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-800">{t('dashboard.client.password.title')}</h3>
            <button
              onClick={() => setShowChangePassword((s) => !s)}
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm bg-accent text-white"
            >
              {showChangePassword ? t('dashboard.client.password.hide') || 'Hide' : t('dashboard.client.password.change') || 'Change Password'}
            </button>
          </div>

          {showChangePassword && (
            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
