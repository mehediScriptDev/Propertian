'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FormInput from './FormInput';
import QHomesLogo from './QHomesLogo';
import { useTranslation } from '@/i18n';
import authService from '@/services/authService';

const ResetPasswordForm = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = pathname.split('/')[1] || 'en';
    const { t } = useTranslation(locale);

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Get token from URL query parameter
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError('Invalid or missing reset token');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid reset token');
            return;
        }

        setIsLoading(true);

        try {
            // Call backend API to reset password
            await authService.resetPassword({
                token: token,
                newPassword: password,
            });

            setSuccess(true);

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                router.push(`/${locale}/login`);
            }, 3000);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(
                err.message || 'Failed to reset password. The link may have expired.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className='flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-8 sm:p-10 shadow-2xl'>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <div className='h-16 w-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center'>
                        <span className='material-symbols-outlined text-green-500 text-4xl'>
                            check_circle
                        </span>
                    </div>
                    <h2 className='text-2xl font-bold text-charcoal-800 dark:text-background-light'>
                        Password Reset Successful!
                    </h2>
                    <p className='text-sm text-charcoal-500 dark:text-charcoal-300 max-w-sm'>
                        Your password has been reset successfully. Redirecting to login
                        page...
                    </p>
                    <Link
                        href={`/${locale}/login`}
                        className='text-primary font-medium hover:underline mt-2'
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-8 sm:p-10 shadow-2xl'>
            <div className='flex flex-col items-center gap-3 pb-2'>
                <QHomesLogo className='h-12 w-auto' />
                <h1 className='text-charcoal-800 dark:text-background-light text-3xl sm:text-4xl font-bold tracking-tight text-center'>
                    Create New Password
                </h1>
                <p className='text-charcoal-500 dark:text-charcoal-300 text-center text-sm max-w-md'>
                    Enter your new password below
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className='flex w-full flex-col items-stretch gap-4 mt-2'
                noValidate
            >
                {error && (
                    <div className='rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400'>
                        {error}
                    </div>
                )}

                <FormInput
                    label='New Password'
                    type='password'
                    name='password'
                    placeholder='Enter new password'
                    icon='Lock'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label='Confirm Password'
                    type='password'
                    name='confirmPassword'
                    placeholder='Confirm new password'
                    icon='Lock'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button
                    type='submit'
                    disabled={isLoading || !token}
                    className='flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-bold text-charcoal-800 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark mt-1 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>

                <p className='text-center text-sm text-charcoal-500 dark:text-charcoal-300 mt-2'>
                    Remember your password?{' '}
                    <Link
                        href={`/${locale}/login`}
                        className='text-primary font-medium hover:underline'
                    >
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
