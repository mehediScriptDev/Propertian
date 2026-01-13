"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n";
import ProfileDropDown from "../ProfileDropDown";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import { TbHeartHandshake } from "react-icons/tb";
import { PiHandshakeDuotone } from "react-icons/pi";
import NotificationButton from "./NotificationButton";

/**
 * Dashboard Header Component
 * Production-grade responsive header with user info
 */
export default function DashboardHeader({ title }) {
  const { user, setPartnerSubrole } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { t } = useTranslation(locale);
  // Show the partner dropdown on partner area as well as sponsor/concierge sub-dashboards
  const isPartner =
    pathname?.includes("/dashboard/partner") ||
    pathname?.includes("/dashboard/sponsor") ||
    pathname?.includes("/dashboard/concierge");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Title - Add left margin on mobile for hamburger button */}
        <div className="flex-1 min-w-0 lg:ml-0 ml-16">
          {isPartner ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Partner dashboard menu"
                onClick={() => setOpen((s) => !s)}
                className="inline-flex items-center text-xl sm:text-2xl font-semibold text-gray-900 focus:outline-none px-2 py-1 rounded group"
              >
                <span className="truncate">{title}</span>
                <svg
                  className={`h-7 w-7 mt-1.5 transform transition-transform duration-200 ease-in-out ${
                    open
                      ? "rotate-180 text-[#E6B325] -mt-1"
                      : "text-gray-500 group-hover:text-[#E6B325]"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <ul
                  role="menu"
                  className="absolute z-40 mt-2 w-72 rounded-md border border-gray-200 bg-white shadow-xl py-2"
                >
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => {
                        // Clear partner subrole (default listing view)
                        setPartnerSubrole(null);
                        setOpen(false);
                        router.push(`/${locale}/dashboard/partner`);
                      }}
                      className="w-full text-left group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors rounded"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition-colors">
                        <PiBuildingApartmentDuotone className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">Listing Partner</span>
                        <span className="text-xs text-gray-400">Manage your property listings</span>
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => {
                        setPartnerSubrole('sponsor');
                        setOpen(false);
                        router.push(`/${locale}/dashboard/sponsor`);
                      }}
                      className="w-full text-left group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors rounded"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-700   transition-colors">
                        <TbHeartHandshake className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">Sponsor</span>
                        <span className="text-xs text-gray-400">Sponsorship & promotions</span>
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => {
                        setPartnerSubrole('concierge');
                        setOpen(false);
                        router.push(`/${locale}/dashboard/concierge`);
                      }}
                      className="w-full text-left group flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors rounded"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-700   transition-colors">
                        <PiHandshakeDuotone className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">Concierge Partner</span>
                        <span className="text-xs text-gray-400">Concierge & premium services</span>
                      </span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-1">
          {/* Notification Button - visible for admin, partner, concierge */}
          <NotificationButton />
          
          <div className="hidden sm:flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700">
            <ProfileDropDown />
          </div>
          {/* Mobile: Show only role initial */}
          <div className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
            {user ? <ProfileDropDown /> : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
