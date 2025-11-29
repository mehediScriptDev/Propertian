"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";



export default function Header() {
        const { locale } = useLanguage();
  const { t } = useTranslation(locale);
    return (
        <div className="bg-white/50 border border-gray-200 rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">{t("dashboard.client.supportTicket.title")}</h1>
            <p className="text-sm sm:text-base text-black/80">{t("dashboard.client.supportTicket.subtitle")}</p>
        </div>
    );
}
