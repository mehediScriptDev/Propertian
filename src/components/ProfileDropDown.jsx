import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, LogOut, UserCircle, Home, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ProfileDropDown = ({ showOnHover = false, useArrow = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')?.[1] || 'en';
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Check if user is on dashboard route
  const isOnDashboard = pathname?.includes('/dashboard');

  const logOutHandler = async () => {
    await logout();
    // Force full navigation to localized login to ensure cookies/middleware are re-evaluated
    window.location.href = `/${locale}/login`;
  };

  // click outside close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // clear any pending close timers and close immediately
        if (closeTimeout.current) {
          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        }
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // profile icon maker
  // compute initials for avatar (First name first letter + Last name first letter)
  const initials = (() => {
    if (!user) return '';
    const first = (user.firstName || user.givenName || '').trim();
    const last = (user.lastName || user.familyName || '').trim();

    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }

    // fallback: try to derive from fullName
    const full = (user.fullName || '').trim();
    if (full) {
      const parts = full.split(/\s+/).filter(Boolean);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    return '';
  })();



  return (
    <div
      className='relative flex items-end justify-center gap-1.5'
      ref={dropdownRef}
      onMouseEnter={() => {
        if (!showOnHover) return;
        if (closeTimeout.current) {
          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        }
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (!showOnHover) return;
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => {
          setOpen(false);
          closeTimeout.current = null;
        }, 150);
      }}
    >
      {/* trigger button (click or hover based on props) */}
      <div
        className='relative flex items-center lg:border lg:border-gray-200 rounded-full px-3 -py-2 cursor-pointer'
        onMouseEnter={() => {
          if (!showOnHover) return;
          if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
          }
          setOpen(true);
        }}
        onMouseLeave={() => {
          if (!showOnHover) return;
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          closeTimeout.current = setTimeout(() => {
            setOpen(false);
            closeTimeout.current = null;
          }, 150);
        }}
      >
        <button
          onClick={() => !showOnHover && setOpen((prev) => !prev)}
          className='relative flex items-center cursor-pointer justify-center  h-8 rounded-md lg:-ml-2  dark:border-gray-700 hover:border-[#C5A572] dark:hover:border-[#C5A572] transition-all duration-200 group bg-transparent dark:bg-transparent '
          aria-haspopup='true'
          aria-expanded={open}
        >
          {/* Always show a small down arrow trigger (no avatar) */}
          <User className='w-5 h-5 text-gray-700 dark:text-gray-200' />
           <p className='text-xs font-semibold hidden lg:block cursor-pointer'>Profile</p>
        </button>
      </div>

      {/* dropdown menu with premium styling */}
      <div
        className={`absolute top-14 right-0 w-56 bg-white dark:bg-[#0F1B2E] rounded-md shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 origin-top-right transition-all duration-200 ease-out
        ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        onMouseEnter={() => {
          if (!showOnHover) return;
          if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
          }
          setOpen(true);
        }}
        onMouseLeave={() => {
          if (!showOnHover) return;
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          closeTimeout.current = setTimeout(() => {
            setOpen(false);
            closeTimeout.current = null;
          }, 150);
        }}
      >
        {/* (Header removed) - keeping menu minimal per request */}

        {/* Menu items */}
        <div className='py-2 px-2'>
          {/* Dashboard or Home - Dynamic based on route */}
          {isOnDashboard ? (
            <Link
              href={`/${locale}`}
              className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#f6efcb] dark:hover:bg-[#1A2B42] rounded-lg transition-all duration-150 group'
            >
              <Home className='w-5 h-5 group-hover:scale-110 transition-transform' />
              <span>Home</span>
            </Link>
          ) : (
            <Link
              href={`/${locale}/dashboard/${user?.role || 'admin'}`}
              className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#f6efcb] dark:hover:bg-[#1A2B42] rounded-lg transition-all duration-150 group'
            >
              <LayoutDashboard className='w-5 h-5 group-hover:scale-110 transition-transform' />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Divider */}
          <div className='h-px bg-[#ecd077]/30 dark:bg-gray-700 my-2'></div>

          {/* Logout */}
          <button
            onClick={logOutHandler}
            className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150 group'
          >
            <LogOut className='w-5 h-5 group-hover:scale-110 transition-transform' />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
