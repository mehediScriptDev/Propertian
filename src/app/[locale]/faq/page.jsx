
"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import React, { useState } from "react";

const title = "Hotel Buying FAQs";
const subtitle =
  "Get answers to common questions about purchasing hotels, ownership process, legal requirements, and investment opportunities.";

const faqs = [
  {
    question: "How can I buy a hotel property through your platform?",
    answer:
      "You can browse listed hotels for sale, filter by location, budget, and type, then contact our sales team or submit an inquiry to start the buying process.",
  },
  {
    question: "Do I need a business license to buy a hotel?",
    answer:
      "Yes, owning or operating a hotel usually requires a valid business license, along with local government approvals and tax registration.",
  },
  {
    question: "Can international buyers purchase hotels?",
    answer:
      "Absolutely. Foreign investors can buy hotels in many regions, though some countries have restrictions on land ownership. Our legal partners can help guide you through this process.",
  },
  {
    question: "What documents are required for hotel purchase?",
    answer:
      "You’ll typically need your identification, proof of funds, a purchase agreement, and legal documents verifying the property’s ownership and permits.",
  },
  {
    question: "How long does the buying process take?",
    answer:
      "Depending on location and due diligence, a hotel purchase can take 30–90 days to finalize, including property inspection and legal verification.",
  },
  {
    question: "Can I get financing or a loan to buy a hotel?",
    answer:
      "Yes, we work with trusted financial partners to offer mortgage and commercial loan options for qualified buyers.",
  },
];

const ContactFAQ = React.memo(() => {
   const { locale } = useLanguage();
      const { t } = useTranslation(locale);
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-10 sm:py-16  px-4">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy dark:text-[#FFFFF0]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-navy/70 dark:text-[#FFFFF0]/70">
            {subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="w-full space-y-4 ">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-navy-light transition-all duration-300"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between cursor-pointer"
              >
                <h3 className="text-base sm:text-lg font-semibold text-navy dark:text-[#FFFFF0] text-left">
                  {faq.question}
                </h3>
                <span
                  className={`material-symbols-outlined text-[#D4AF37] transform transition-transform duration-500 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Animated Answer */}
              <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100 mt-3"
                    : "grid-rows-[0fr] opacity-0 mt-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm sm:text-base text-navy/70 dark:text-[#FFFFF0]/70">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ContactFAQ.displayName = "ContactFAQ";
export default ContactFAQ;
