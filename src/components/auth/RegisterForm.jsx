"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import FormInput from './FormInput';
import SocialButton from './SocialButton';
import Divider from './Divider';
import QHomesLogo from './QHomesLogo';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';

const RegisterForm = () => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';
    const { t } = useTranslation(locale);
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        readPrivacy: false,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = t('auth.register.errors.fullNameRequired') || 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = t('auth.register.errors.fullNameMinLength') || 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = t('auth.register.errors.emailRequired') || 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('auth.register.errors.emailInvalid') || 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = t('auth.register.errors.passwordRequired') || 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.register.errors.passwordMinLength') || 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.errors.confirmPasswordRequired') || 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.errors.passwordMismatch') || 'Passwords do not match';
        }

        // Terms acceptance validation
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = t('auth.register.errors.acceptTerms') || 'You must accept the terms and conditions';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Split name into firstName and lastName
            const nameParts = formData.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || nameParts[0];

            // Call register from AuthContext
            // Adjust these field names to match your backend API requirements
            await register({
                firstName: firstName,
                lastName: lastName,
                email: formData.email,
                password: formData.password,
                // Don't send role - backend will set default role
            });
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                general: error.message || error.data?.message || t('auth.register.errors.registrationFailed') || 'Registration failed',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-2 pb-4">
                <QHomesLogo className="h-12 w-auto" />
                <h1 className="text-charcoal-800 dark:text-background-light text-2xl sm:text-3xl font-bold tracking-tight">
                    {t('auth.register.title')}
                </h1>
                <p className="text-charcoal-500 dark:text-charcoal-300 text-center text-sm">
                    {t('auth.register.subtitle')}
                </p>
            </div>

            {errors.general && (
                <div
                    className='w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2'
                    role='alert'
                >
                    <span className='material-symbols-outlined text-base'>error</span>
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4" noValidate>
                <FormInput
                    label={t('auth.register.fullName')}
                    type="text"
                    name="fullName"
                    placeholder={t('auth.register.fullNamePlaceholder')}
                    icon="User"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label={t('auth.register.email')}
                    type="email"
                    name="email"
                    placeholder={t('auth.register.emailPlaceholder')}
                    icon="Mail"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label={t('auth.register.password')}
                    type="password"
                    name="password"
                    placeholder={t('auth.register.passwordPlaceholder')}
                    icon="Lock"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label={t('auth.register.confirmPassword')}
                    type="password"
                    name="confirmPassword"
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                    icon="Lock"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                    disabled={isLoading}
                />
                {/* Terms & Privacy checkboxes */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-start gap-3 text-sm text-charcoal-700 dark:text-charcoal-300">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-4 w-4 mt-0.5 rounded-lg border border-charcoal-300 dark:border-charcoal-600 bg-background-light dark:bg-background-dark text-primary focus:ring-primary accent-black checked:scale-110 checked:border-transparent transform transition-transform duration-150 ease-in-out"
                            style={{ accentColor: '#000' }}
                        />
                        <span className="leading-tight">
                            I agree to the{' '}
                            <Link href={`/${locale}/terms-conditions`} className="underline text-primary hover:text-primary/90">
                                Terms &amp; Conditions
                            </Link>
                        </span>
                    </label>
                    {errors.acceptTerms && (
                        <p className="text-red-600 dark:text-red-400 text-xs ml-7">{errors.acceptTerms}</p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-charcoal-700 dark:text-charcoal-300">
                        <input
                            type="checkbox"
                            name="readPrivacy"
                            checked={formData.readPrivacy}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-4 w-4 mt-0.5 rounded-lg border border-charcoal-300 dark:border-charcoal-600 bg-background-light dark:bg-background-dark text-primary focus:ring-primary accent-black checked:scale-110 checked:border-transparent transform transition-transform duration-150 ease-in-out"
                            style={{ accentColor: '#000' }}
                        />
                        <span className="leading-tight">
                            I have read the{' '}
                            <Link href={`/${locale}/privacy-policy`} className="underline text-primary hover:text-primary/90">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-bold text-charcoal-800 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <span className='material-symbols-outlined animate-spin mr-2'>
                                progress_activity
                            </span>
                            {t('auth.register.creatingAccount') || 'Creating Account...'}
                        </>
                    ) : (
                        t('auth.register.createAccount')
                    )}
                </button>


            </form>

            {/* <Divider text={t('auth.register.orDivider')} />
 
            <div className="flex w-full flex-col gap-3">
                <SocialButton provider="google" onClick={() => { }} disabled={isLoading}>
                  {  t('auth.register.continueWithGoogle')}
                </SocialButton>
 
                <SocialButton provider="facebook" onClick={() => { }} disabled={isLoading}>
                    {  t('auth.register.continueWithFacebook')}
                </SocialButton>
            </div> */}

            <div className="pt-4 text-center">
                <p className="text-charcoal-500 dark:text-charcoal-300 text-sm font-normal">
                    {t('auth.register.haveAccount')}{' '}
                    <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">
                        {t('auth.register.loginNow')}
                    </Link>
                </p>
            </div>

            <div className="pt-2 text-center">
                <Link href={`/${locale}`} className="text-charcoal-500 dark:text-charcoal-300 text-sm font-normal hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    {t('auth.register.backToHome')}
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;

