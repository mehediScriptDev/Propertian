"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import FormInput from './FormInput';
import QHomesLogo from './QHomesLogo';

const ForgotPasswordForm = () => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';

    const [email, setEmail] = useState('');
    const [isLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState('');

    const maskEmail = (addr) => {
        if (!addr || !addr.includes('@')) return addr;
        const [local, domain] = addr.split('@');
        const first = local.charAt(0) || '';
        return `${first}***@${domain}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Design only - show confirmation UI with masked email
        setMaskedEmail(maskEmail(email));
        setShowConfirmation(true);
    };

    const handleResend = (e) => {
        e?.preventDefault();
        // design-only: toggle/show confirmation again (could show a toast)
        setMaskedEmail(maskEmail(email));
        setShowConfirmation(true);
    };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col items-center gap-3 pb-2">
                <QHomesLogo className="h-12 w-auto" />
                <h1 className="text-charcoal-800 dark:text-background-light text-3xl sm:text-4xl font-bold tracking-tight text-center">
                    Forgot Your Password?
                </h1>
                <p className="text-charcoal-500 dark:text-charcoal-300 text-center text-sm max-w-md">
                    Enter your email to receive a password reset link. We&apos;ll send instructions on how to reset it.
                </p>
            </div>

            {!showConfirmation ? (
                <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4 mt-2" noValidate>
                    <FormInput
                        label={'Email Address'}
                        type="email"
                        name="email"
                        placeholder={'you@example.com'}
                        icon="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-bold text-charcoal-800 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send Reset Link
                    </button>

                    <p className="text-center text-sm text-charcoal-500 dark:text-charcoal-300 mt-2">
                        Remember your password?{' '}
                        <Link href={`/${locale}/login`} className="text-primary font-medium hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </form>
            ) : (
                <div className="w-full">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-white dark:bg-background-dark/80 text-center">
                        <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">mail</span>
                        </div>
                        <h2 className="text-2xl font-bold text-charcoal-800">Check Your Email</h2>
                        <p className="text-sm text-charcoal-500 max-w-xs">
                            We&apos;ve sent password reset instructions to {maskedEmail}. Please check your inbox and spam folder.
                        </p>

                        <div className="w-full mt-4">
                            <Link href={`/${locale}/login`} className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-bold text-charcoal-800 hover:bg-primary/90">
                                Return to Login
                            </Link>
                        </div>

                        <p className="text-sm text-charcoal-500 mt-3">
                            Didn&apos;t receive the email?{' '}
                            <a href="#" onClick={handleResend} className="underline text-primary hover:text-primary/90">Resend</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
