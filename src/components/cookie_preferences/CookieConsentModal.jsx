"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    Promise.resolve().then(() => {
      const savedPrefs = Cookies.get("cookiePreferences");
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
          setIsOpen(false);
        } catch {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    });
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true };
    Cookies.set("cookiePreferences", JSON.stringify(allPrefs), {
      expires: 365,
    });
    setPreferences(allPrefs);
    setIsOpen(false);
  };

  const handleSave = () => {
    Cookies.set("cookiePreferences", JSON.stringify(preferences), {
      expires: 365,
    });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <body className="bg-background-light dark:bg-background-dark font-display">
      <div
        className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gray-200 dark:bg-gray-800"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSCFYlYxB8h35FnF2HDlS5Xxvj-8UcUBS1TLLSrohAX36u_huMWAQqTdr6cypYeIoVVWwxHr0nHHNi0PzVnB5R_fo7ZT3NBoOGztJSuPbrEYDB4dt-y6teHPX5Bz0e0O1YNku112Gv_5sAdk2jGyzMgA506YzVzrZYGFI_AGEseFE3h6ODfbUzDKt2QFL9-txpAExIhq7rqB_ECMF9ogGGLSIhkpLfS1CgKDR_Up0SQWg_R7_X8vgE9K1Lopyf7yQsnF06_QIj6xI')",
        }}
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

        <div className="relative z-50 flex w-full max-w-2xl flex-col rounded-xl bg-brand-ivory shadow-2xl dark:bg-[#202932]">
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-brand-navy dark:text-white">
              Manage Your Cookie Preferences
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-6 p-6">
            <p className="text-base text-brand-dark-grey dark:text-gray-300">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. You can control
              your preferences for each category below.
            </p>

            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
              {/* Essential */}
              <div className="flex items-center gap-4 py-4">
                <div className="text-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-brand-gold">
                  <span className="material-symbols-outlined text-2xl">
                    lock
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-medium text-brand-dark-grey dark:text-white">
                    Essential Cookies
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These cookies are necessary for the website to function and
                    cannot be switched off. They are always active.
                  </p>
                </div>
                <div className="shrink-0">
                  <label className="relative flex h-[31px] w-[51px] cursor-not-allowed items-center rounded-full border-none bg-brand-light-grey p-0.5 justify-end dark:bg-gray-600">
                    <div
                      className="h-full w-[27px] rounded-full bg-white dark:bg-gray-400"
                      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px" }}
                    ></div>
                    <input
                      checked
                      disabled
                      type="checkbox"
                      className="invisible absolute"
                    />
                  </label>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center gap-4 py-4">
                <div className="text-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-brand-gold">
                  <span className="material-symbols-outlined text-2xl">
                    bar_chart
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-medium text-brand-dark-grey dark:text-white">
                    Analytics Cookies
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These cookies allow us to count visits and traffic sources
                    to measure and improve the performance of our site.
                  </p>
                </div>
                <div className="shrink-0">
                  <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-brand-navy dark:bg-gray-600 dark:has-[:checked]:bg-brand-gold">
                    <div
                      className="h-full w-[27px] rounded-full bg-white transition-transform dark:bg-gray-300"
                      style={{
                        boxShadow:
                          "rgba(0,0,0,0.15) 0px 3px 8px, rgba(0,0,0,0.06) 0px 3px 1px",
                      }}
                    ></div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handleToggle("analytics")}
                      className="invisible absolute"
                    />
                  </label>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-center gap-4 py-4">
                <div className="text-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-brand-gold">
                  <span className="material-symbols-outlined text-2xl">
                    campaign
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-medium text-brand-dark-grey dark:text-white">
                    Marketing Cookies
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These cookies are used to build a profile of your interests
                    and show you relevant adverts and property recommendations.
                  </p>
                </div>
                <div className="shrink-0">
                  <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-brand-navy dark:bg-gray-600 dark:has-[:checked]:bg-brand-gold">
                    <div
                      className="h-full w-[27px] rounded-full bg-white transition-transform dark:bg-gray-300"
                      style={{
                        boxShadow:
                          "rgba(0,0,0,0.15) 0px 3px 8px, rgba(0,0,0,0.06) 0px 3px 1px",
                      }}
                    ></div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handleToggle("marketing")}
                      className="invisible absolute"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row-reverse items-center gap-3 rounded-b-xl bg-gray-50 p-6 dark:bg-[#111921]">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto rounded-lg bg-brand-navy px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-navy/50 dark:bg-brand-gold dark:text-brand-navy dark:hover:bg-brand-gold/90 dark:focus:ring-brand-gold/50"
            >
              Accept All
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </body>
  );
}
