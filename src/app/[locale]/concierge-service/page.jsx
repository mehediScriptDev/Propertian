"use client";
import ComprehensiveSection from "@/components/concierge_service/ComprehensiveSection";
import FinalCTASection from "@/components/concierge_service/FinalCTASection";
import HeroSection from "@/components/concierge_service/HeroSection";
import HowItWorks from "@/components/concierge_service/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";

export default function ConciergeServicePage() {
  const { locale } = useLanguage();

  const testimonials = [
    {
      id: 1,
      quote:
        "The team at Q HOMES made our dream of owning a beachfront villa a reality. Their professionalism and local knowledge are unmatched.",
      name: "Amina Diop",
      title: "Investor from France",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      quote:
        "As a first-time buyer in Abidjan, I was nervous. Q HOMES guided me every step of the way with patience and expertise.",
      name: "Koffi Brou",
      title: "Abidjan Resident",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col ">
        <HeroSection />
        <ComprehensiveSection />
        <HowItWorks />
        <Testimonials testimonials={testimonials} locale={locale} />
        <FinalCTASection />
      </div>
    </main>
  );
}
