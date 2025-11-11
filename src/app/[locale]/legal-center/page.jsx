import React from "react";
import LegalCenterComponents from "@/components/legal_center/LegalCenterComponents";

const legalDocuments = [
  {
    title: "Terms & Conditions",
    description:
      "Outlines the rules and guidelines for using our services and platform.",
    iconName: "description",
    href: "/terms-conditions",
  },
  {
    title: "Privacy Policy",
    description: "Details how we collect, use, and protect your personal data.",
    iconName: "shield_lock",
    href: "/privacy-policy",
  },
  {
    title: "Cookie Policy",
    description:
      "Explains how we use cookies to enhance your browsing experience.",
    iconName: "cookie",
    href: "/cookie-policy",
  },
  {
    title: "Partner Directory",
    description:
      "Our commitment to ensuring our platform is usable by everyone.",
    iconName: "accessibility_new",
    href: "/partner-directory",
  },
  {
    title: "Concierge Service",
    description:
      "Important information about limitations of liability and platform use.",
    iconName: "gavel",
    href: "/concierge-service",
  },
];

export default function LegalCenter() {
  return (
    <>
      <LegalCenterComponents legalDocuments={legalDocuments} />
    </>
  );
}
