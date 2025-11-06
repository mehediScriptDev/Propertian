"use client";
import YourCookie from "@/components/cookie_preferences/YourCookie";
import React from "react";

const cookieCategories = [
  {
    id: "essential",
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off. They are always active.",
    iconName: "lock",
    mandatory: true,
  },
  {
    id: "analytics",
    title: "Analytics Cookies",
    description:
      "These cookies allow us to count visits and traffic sources to measure and improve the performance of our site.",
    iconName: "bar_chart",
    mandatory: false,
    initialChecked: true,
  },
  {
    id: "marketing",
    title: "Marketing Cookies",
    description:
      "These cookies are used to build a profile of your interests and show you relevant adverts and property recommendations.",
    iconName: "campaign",
    mandatory: false,
    initialChecked: false,
  },
];

export default function CookiePreferences() {
  return (
    <>
      <YourCookie cookieCategories={cookieCategories} />
    </>
  );
}
