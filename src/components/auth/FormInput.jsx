'use client';

import { forwardRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';

const FormInput = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      placeholder,
      icon,
      error,
      required = false,
      autoComplete,
      className = '',
      ...rest
    },
    ref
  ) => {
    const inputId = `input-${name}`;
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    // Get Lucide icon component
    const IconComponent = icon ? LucideIcons[icon] : null;

    return (
      <div className='flex w-full flex-col'>
        <label htmlFor={inputId} className='flex flex-col w-full'>
          <span className='text-charcoal-800 dark:text-background-light text-sm font-medium pb-2'>
            {label}
            {required && (
              <span className='text-red-600 ml-1' aria-label='required'>
                *
              </span>
            )}
          </span>

          <div className='flex w-full items-center rounded-lg relative'>
            {IconComponent && (
              <div
                className='flex items-center justify-center w-12 h-12 border-y border-l border-charcoal-200 dark:border-charcoal-600 bg-charcoal-50 dark:bg-charcoal-700/50 rounded-l-lg'
                aria-hidden='true'
              >
                <IconComponent className='text-charcoal-400 dark:text-charcoal-300 h-5 w-5' />
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              name={name}
              type={inputType}
              placeholder={placeholder}
              autoComplete={autoComplete}
              required={required}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className={`
                form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden
                ${icon && !isPasswordField ? 'rounded-r-lg border-y border-r' : icon && isPasswordField ? 'rounded-r-lg border-y border-r' : 'rounded-lg border'}
                ${icon ? 'border-l-0' : ''}
                ${isPasswordField ? 'pr-12' : ''}
                text-charcoal-800 dark:text-background-light
                focus:outline-0 focus:ring-0
                ${error
                  ? 'border-red-500'
                  : 'border-charcoal-200 dark:border-charcoal-600'
                }
                bg-white dark:bg-charcoal-800
                h-12 px-3 text-base font-normal leading-normal
                placeholder:text-charcoal-400 dark:placeholder:text-charcoal-300
                transition-all duration-200
                focus:border-primary focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)]
                disabled:bg-charcoal-100 disabled:cursor-not-allowed
                ${className}
              `}
              {...rest}
            />

            {isPasswordField && (
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <LucideIcons.EyeOff className='h-5 w-5 text-charcoal-400 dark:text-charcoal-300' />
                ) : (
                  <LucideIcons.Eye className='h-5 w-5 text-charcoal-400 dark:text-charcoal-300' />
                )}
              </button>
            )}
          </div>
        </label>

        {error && (
          <p
            id={`${inputId}-error`}
            className='text-red-600 text-xs mt-1.5 flex items-center gap-1'
            role='alert'
          >
            <LucideIcons.AlertCircle className='h-4 w-4' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
