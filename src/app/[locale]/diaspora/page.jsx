"use client";

import CountdownTimer from "@/components/event/CountdownTimer";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo } from "react";
import { useTranslation } from "@/i18n";
import { FileText, Lock, Shield } from "lucide-react";

export default function Page({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale ?? "en");

  const eventDate = new Date("2026-12-26T19:00:00Z");

  const heroTranslations = useMemo(
    () => ({
      title: t("event.hero.title"),
      subtitle: t("event.hero.subtitle"),
      cta: t("event.hero.cta"),
    }),
    [t]
  );

  const countdownTranslations = useMemo(
    () => ({
      days: t("event.countdown.days"),
      hours: t("event.countdown.hours"),
      minutes: t("event.countdown.minutes"),
      seconds: t("event.countdown.seconds"),
    }),
    [t]
  );
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description:
        "Every property is meticulously vetted, ensuring your investment is safe and legitimate.",
      iconColor: "#C5A572",
      bgColor: "bg-[#0A1931]",
    },
    {
      icon: Lock,
      title: "Secure Escrow & Financing",
      description:
        "Partnering with trusted financial institutions for transparent and secure transactions.",
      iconColor: "#C5A572",
      bgColor: "bg-[#0A1931]",
    },
    {
      icon: FileText,
      title: "Legal & POA Support",
      description:
        "Navigate the legal landscape with ease through our expert guidance and Power of Attorney services.",
      iconColor: "#C5A572",
      bgColor: "bg-[#0A1931]",
    },
  ];

  return (
    <section className="w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* herobg */}
      <div
        className="flex sm:min-h-[480px] flex-col gap-5 md:gap-6 bg-cover bg-center bg-no-repeat rounded-xl md:rounded-2xl items-center justify-center p-6 md:p-8 lg:p-10 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 25, 49, 0.65) 0%, rgba(10, 25, 49, 0.65) 100%), url("/map.jpg")`,
        }}
        role="banner"
      >
        <div className="flex flex-col gap-4 md:gap-5  w-full">
          <h1
            id="hero-title"
            className="text-white lg:text-5xl text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]"
          >
            Your Bridge to Homeownership from Abroad —{" "}
            <span className="text-primary">Coming Soon</span>
          </h1>
          <p className="text-gray-200 text-[15px] sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Access verified listings, secure escrow, and tailored financing.
            Your journey home begins here.
          </p>
          {/* timer */}
          <CountdownTimer
            targetDate={eventDate}
            translations={countdownTranslations}
          />
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mt-2">
            <Link
              href={"#form"}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 md:px-8 lg:px-10 py-3 md:py-3.5 rounded-lg transition-all duration-200 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Book a consultation with our concierge team"
            >
              Join Diaspora Hub Waitlist
            </Link>
          </div>
        </div>
      </div>

      {/* A Seamless & Secure Path to Property */}
      <div>
        <div>
          <div className="w-full mx-auto max-w-7xl pt-12">
            {/* Section Header (match EventRegistration styles) */}
            <div className="text-center mb-6 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                A Seamless & Secure Path to Property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                We&apos;re building a platform that removes the barriers to
                investing in your homeland. From finding the perfect property to
                finalizing the paperwork, we&apos;ve got you covered.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white/50 rounded-xl p-6 sm:p-8 border border-[#C5A572]/50 transition-all duration-300 `}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-lg bg-back bg-[#f6efd1] flex items-center justify-center">
                        <Icon
                          className="w-7 h-7 text-[#d4af37]"
                          style={{ color: feature.iconColor }}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-navy dark:text-white mb-3 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* form */}
      <div id="form">
        {/* Waitlist Section */}
        <div  className="w-full mx-auto max-w-7xl pt-12">
          <div className="bg-white/50 border border-[#C5A572]/50 rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Be the First to Know
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-4">
                Sign up to our waitlist for exclusive updates, early access, and
                special launch offers.
              </p>
            </div>

            <form
              className="space-y-5 max-w-4xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                alert(
                  `Thank you for joining!\n\nName: ${formData.get(
                    "fullName"
                  )}\nEmail: ${formData.get("email")}\nCountry: ${formData.get(
                    "country"
                  )}\nInterested in: ${formData.get("interest")}`
                );
                e.currentTarget.reset();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col items-start">
                  <label
                    htmlFor="fullName"
                    className="text-gray-900 dark:text-white text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3.5 bg-transparent border border-[#C5A572]/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label
                    htmlFor="email"
                    className="text-gray-900 dark:text-white text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3.5 bg-transparent border border-[#C5A572]/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label
                    htmlFor="country"
                    className="text-gray-900 dark:text-white text-sm font-medium mb-2"
                  >
                    Country of Residence
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    defaultValue="United States"
                    className="w-full px-4 py-3.5 bg-transparent border border-[#C5A572]/50 rounded-lg text-gray-900 dark:text-white focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 outline-none transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23b8c5d6' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="India">India</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col items-start">
                  <label
                    htmlFor="interest"
                    className="text-gray-900 dark:text-white text-sm font-medium mb-2"
                  >
                    I am interested in:
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    required
                    defaultValue=""
                    className="w-full px-4 py-3.5 bg-transparent border border-[#C5A572]/50 rounded-lg text-gray-900 dark:text-white focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 outline-none transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23b8c5d6' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="" disabled>Select your interest</option>
                    <option value="buying">Buying</option>
                    <option value="renting">Renting</option>
                    <option value="investing">Investing</option>
                    <option value="relocating">Relocating</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3.5 bg-primary text-[#0a1929] rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#C5A572]/30 hover:-translate-y-0.5"
              >
                Join Waitlist →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* family and quotes */}
      <div>
        <div className="flex md:flex-row flex-col justify-between items-center pt-12 gap-10">
          <img src="/diaspora/family.png" className="h-[553px] w-[552px] rounded-xl" alt="family" />
          <div>
            <h1 className="text-3xl text-center md:text-left sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">&quot;Home is not where you are from, it is where you belong. Some of us travel the whole world to find it.&quot;</h1>
          <p className="text-xl font-semibold text-primary">- Donna Karan</p>
          </div>

        </div>
      </div>
    </section>
  );
}
