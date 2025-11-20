"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ApplicationForm, HowItWorks } from "@/components/partner";

export default function VerificationPage() {
  const [form, setForm] = useState({
    name: "", 
    email: "",
    age: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.age || Number(form.age) <= 0) err.age = "Valid age is required";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // For now we simulate a successful submission client-side
      setSubmitted(true);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 ">
   =
      <HowItWorks />
      <ApplicationForm />
    </main>
  );
}
