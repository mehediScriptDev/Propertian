"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SmsSetupClient() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+225");
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const [codeSent, setCodeSent] = useState(false);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const verificationInputRefs = useRef([]);
    const router = useRouter();

    const handleSendVerificationCode = (e) => {
        e.preventDefault();
        if (!phoneNumber) {
            setStatus("error");
            setMessage("Please enter your phone number.");
            return;
        }
        setStatus("sending");
        setMessage("");
        setTimeout(() => {
            setCodeSent(true);
            setStatus("idle");
            setMessage("");
        }, 1000);
    };

    const handleVerificationCodeChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;
        const newCode = [...verificationCode];
        newCode[index] = value.slice(0, 1);
        setVerificationCode(newCode);
        if (value && index < 5) verificationInputRefs.current[index + 1]?.focus();
    };

    const handleVerificationCodeKeyDown = (index, e) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            verificationInputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyAndActivate = (e) => {
        e.preventDefault();
        const fullCode = verificationCode.join("");
        if (fullCode.length !== 6) {
            setStatus("error");
            setMessage("Please enter the complete 6-digit code.");
            return;
        }
        setStatus("verifying");
        setMessage("");
        setTimeout(() => {
            setStatus("success");
            setMessage("2FA activated successfully!");
            setTimeout(() => {
                // router.push("/dashboard");
            }, 2000);
        }, 1000);
    };

    const handleResendSMS = () => {
        setStatus("sending");
        setVerificationCode(["", "", "", "", "", ""]);
        setTimeout(() => {
            setStatus("idle");
            setMessage("Code resent successfully!");
            setTimeout(() => setMessage(""), 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center  px-4 py-10">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Enhance Your Account Security
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Set up Two-Factor Authentication (2FA) to add an extra layer of protection.
                </p>

                {!codeSent ? (
                    <form onSubmit={handleSendVerificationCode} className="space-y-4">
                        <div>
                            <label
                                htmlFor="countryCode"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Country Code
                            </label>
                            <input
                                type="text"
                                id="countryCode"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${status === "sending"
                                    ? "bg-primary cursor-wait"
                                    : "bg-primary hover:bg-primary-600"
                                }`}
                        >
                            {status === "sending" ? "Sending..." : "Send Verification Code"}
                        </button>

                        {status === "error" && message && (
                            <p className="text-red-500 text-sm">{message}</p>
                        )}
                    </form>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            Enter Verification Code
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                            A 6-digit code was sent to your number. Please enter it below.
                        </p>

                        <form onSubmit={handleVerifyAndActivate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <div className="flex justify-between gap-2">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (verificationInputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleVerificationCodeChange(index, e.target.value)
                                            }
                                            onKeyDown={(e) => handleVerificationCodeKeyDown(index, e)}
                                            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold text-gray-800 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm text-center">
                                <span className="text-gray-500">Didn’t receive a code? </span>
                                <button
                                    type="button"
                                    onClick={handleResendSMS}
                                    disabled={status === "sending"}
                                    className="text-primary hover:text-primary-600 font-medium disabled:opacity-50"
                                >
                                    Resend
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "verifying"}
                                className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${status === "verifying"
                                        ? "bg-primary cursor-wait"
                                        : "bg-primary hover:bg-primary-600"
                                    }`}
                            >
                                {status === "verifying" ? "Verifying..." : "Verify and Activate"}
                            </button>

                            {status === "error" && message && (
                                <p className="text-red-500 text-sm text-center">{message}</p>
                            )}
                            {status === "success" && message && (
                                <p className="text-green-600 text-sm text-center font-medium">
                                    {message}
                                </p>
                            )}
                        </form>

                        <p className="text-gray-400 text-xs mt-5 text-center">
                            Standard message & data rates may apply.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
