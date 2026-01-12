"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  ScrollText,
  Search,
  Building2,
  UserCheck,
  Bell,
  Calendar,
  Settings,
  LogOut,
  Home,
  Heart,
  MessageSquare,
  UserCircle,
  List,
  Mail,
  ChevronDown,
  X,
  Menu,
  Globe,
  Briefcase,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n";
import { RiQuestionnaireLine } from "react-icons/ri";

/**
 * Navigation items configuration for each role - using translation keys
 */
const navigationConfig = {
  admin: [
    {
      key: "dashboard.admin.overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      key: "Listing Partners",
      href: "/dashboard/admin/partners",
      icon: UserCheck,
      // New dropdown children for partner management
      children: [
        {
          key: "Partner Application",
          href: "/dashboard/admin/partners?tab=applications",
          icon: FileText,
        },
        {
          key: "Listing Submission",
          href: "/dashboard/admin/partners?tab=listing-submissions",
          icon: List,
        },
        {
          key: "Verification Requests",
          href: "/dashboard/admin/partners?tab=verification-requests",
          icon: ShieldCheck,
        },
      ],
    },
    {
      key: "Sponsored Events",
      href: "/dashboard/admin/event-management",
      icon: Calendar,
      children: [
        {
          key: "Event Management",
          href: "/dashboard/admin/event-management",
          icon: Calendar,
        },
        {
          key: "Event Request",
          href: "/dashboard/admin/sponsor-events",
          icon: Bell,
        },
        {
          key: "Applications",
          href: "/dashboard/admin/sponsor-applications",
          icon: FileText,
        },
      ],
    },
    {
      key: "Concierge",
      href: "/dashboard/admin/concierge-tickets",
      icon: Bell,
      children: [
        {
          key: "Concierge Tickets",
          href: "/dashboard/admin/concierge-tickets",
          icon: Bell,
        },
        {
          key: "Applications",
          href: "/dashboard/admin/concierge-applications",
          icon: FileText,
        },
      ]
    },
    {
      key: "All inquiries",
      href: "/dashboard/admin/inquiries",
      icon: Users,
    },
    {
      key: "Notifications",
      href: "/dashboard/admin/notifications",
      icon: Bell,
    },
    {
      key: "dashboard.admin.usersLink",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    
    {
      key: "dashboard.admin.propertiesLink",
      href: "/dashboard/admin/properties",
      icon: Building2,
    },
    

    // {
    //   key: 'dashboard.admin.mediaLibrary',
    //   href: '/dashboard/admin/media-library',
    //   icon: Image,
    // },
    // {
    //   key: 'dashboard.admin.auditLogsLink',
    //   href: '/dashboard/admin/audit-logs',

    //   icon: ScrollText,
    // },
    // {
    //   key: 'dashboard.admin.seoManagement',
    //   href: '/dashboard/admin/seo-management',
    //   icon: Search,
    // },

    {
      key: "All Bookings",
      href: "/dashboard/admin/bookings",
      icon: List,
    },
    {
      key: "dashboard.admin.blogEditorLink",
      href: "/dashboard/admin/blog-editor",
      icon: FileText,
    },
    {
      key: "Supports Requests",
      href: "/dashboard/admin/supports",
      icon: HelpCircle,
    },
    {
      key: "Partner Directory",
      href: "/dashboard/admin/partner-directory",
      icon: HelpCircle,
    },
    {
      key: "Contacts",
      href: "/dashboard/admin/contacts",
      icon: Settings,
    },
  ],
  user: [
    {
      key: "dashboard.client.profile",
      href: "/dashboard/user",
      icon: UserCircle,
    },
    {
      key: "dashboard.client.favorites",
      href: "/dashboard/user/favorites",
      icon: Heart,
    },
    // {
    //   key: 'dashboard.client.savedSearches',
    //   href: '/dashboard/client/saved-searches',
    //   icon: RiQuestionnaireLine ,
    // },
    {
      key: "My Inquiries",
      href: "/dashboard/user/inquiries",
      icon: Mail,
    },
    {
      key: "dashboard.client.appointments",
      href: "/dashboard/user/appointments",
      icon: Calendar,
    },
    {
      key: "dashboard.client.tickets",
      href: "/dashboard/user/tickets",
      icon: MessageSquare,
    },
    // {
    //   key: 'dashboard.client.settings',
    //   href: '/dashboard/client/settings',
    //   icon: Settings,
    // },
  ],
  partner: [
    {
      key: "dashboard.partner.properties",
      href: "/dashboard/partner",
      icon: Building2,
    },
    // {
    //   key: 'dashboard.partner.myListings',
    //   href: '/dashboard/partner/my-listings',
    //   icon: List,
    // },
    {
      key: "dashboard.partner.inquiries",
      href: "/dashboard/partner/inquiries",
      icon: Mail,
    },
    {
      key: "Notifications",
      href: "/dashboard/partner/notifications",
      icon: Bell,
    },
    {
      key: "Verifications",
      href: "/dashboard/partner/verified-properties",
      icon: ShieldCheck,
    },
    // {
    //   key: 'dashboard.partner.developerPortal',
    //   href: '/dashboard/partner/developer-portal',
    //   icon: Briefcase,
    // },
    // {
    //   key: 'dashboard.partner.developerInquiry',
    //   href: '/dashboard/partner/developer-inquiry',
    //   icon: HelpCircle,
    // },
    {
      key: "dashboard.partner.profile",
      href: "/dashboard/partner/profile",
      icon: UserCircle,
    },
  ],
  sponsor: [
    {
      key: "Overview",
      href: "/dashboard/sponsor",
      icon: Briefcase,
    },
    {
      key: "Notifications",
      href: "/dashboard/partner/notifications",
      icon: Bell,
    },
    {
      key: "Event Submissions",
      href: "/dashboard/sponsor/submit",
      icon: Calendar,
    },
    {
      key: "Assets",
      href: "/dashboard/sponsor/assets",
      icon: Image,
    },
    {
      key: "Approvals",
      href: "/dashboard/sponsor/approvals",
      icon: ShieldCheck,
    },
    // {
    //   key: 'Metrics',
    //   href: '/dashboard/sponsor/metrics',
    //   icon: Calendar,
    // },
    {
      key: "dashboard.partner.profile",
      href: "/dashboard/sponsor/profile",
      icon: UserCircle,
    },
  ],
  concierge: [
    {
      key: "Dashboard",
      href: "/dashboard/concierge",
      icon: Briefcase,
    },
    {
      key: "Notifications",
      href: "/dashboard/concierge/notifications",
      icon: Bell,
    },
    {
      key: "Assigned Tickets",
      href: "/dashboard/concierge/tickets",
      icon: Mail,
    },
    {
      key: "Quotes & Proposals",
      href: "/dashboard/concierge/services",
      icon: Users,
    },
    // {
    //   key: 'Service history',
    //   href: '/dashboard/concierge/schedule',
    //   icon: Calendar,
    // },
    // {
    //   key: 'Reports',
    //   href: '/dashboard/concierge/reports',
    //   icon: FileText,
    // },
    {
      key: "dashboard.partner.profile",
      href: "/dashboard/concierge/profile",
      icon: UserCircle,
    },
  ],
};

/**
 * Sidebar Navigation Component
 * Production-grade responsive sidebar with mobile menu and client-side language switching
 */
export default function Sidebar({ role = "admin" }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { locale, changeLanguage } = useLanguage();
  const { t } = useTranslation(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { t } = useMemo(() => useTranslation(locale), [locale]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Decide which navigation set to render.
  // For partners we may render different menus depending on subrole or path.
  const navigationItems = useMemo(() => {
    // Non-partner roles use the static mapping
    if (role !== "partner") return navigationConfig[role] || [];

    // Determine partner view: explicit pathname override preferred, then user.subrole
    const partnerViewFromPath = pathname?.includes("/dashboard/sponsor")
      ? "sponsor"
      : pathname?.includes("/dashboard/concierge")
      ? "concierge"
      : null;

    const effectiveView = partnerViewFromPath || user?.subrole || "partner";

    return navigationConfig[effectiveView] || navigationConfig.partner;
  }, [role, pathname, user?.subrole]);

  // Close mobile menu when route changes
  if (pathname !== prevPathname) {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setPrevPathname(pathname);
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };

    if (showLangDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showLangDropdown]);

  /**
   * Check if link is active
   */
  const isActiveLink = (href) => {
    const fullHref = `/${locale}${href}`;
    if (href === `/dashboard/${role}`) {
      // For the base dashboard link (e.g. /dashboard/partner) we normally
      // only mark it active for the exact route. However the partner
      // properties UI lives at /dashboard/partner and also under
      // /dashboard/partner/properties/* (for example when adding a
      // property). Treat those properties subroutes as active for the
      // base partner link so the sidebar highlights "Properties" when
      // the user is on either route.
      if (role === "partner") {
        return (
          pathname === fullHref || pathname.startsWith(`${fullHref}/properties`)
        );
      }
      return pathname === fullHref;
    }
    // For top-level sponsor/concierge overview links we only want an exact match
    // so that child routes (eg. /dashboard/sponsor/approvals) don't also
    // highlight the Overview link. Treat other links as prefix-matching.
    const exactOnlyRoots = ["/dashboard/sponsor", "/dashboard/concierge"];
    if (exactOnlyRoots.includes(href)) {
      return pathname === fullHref;
    }

    return pathname.startsWith(fullHref);
  };

  // Auto-expand menu if current path matches any child
  useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some((child) => {
          const [childPath] = child.href.split("?");
          return isActiveLink(childPath);
        });
        if (hasActiveChild) {
          setExpandedMenu(item.key);
        }
      }
    });
  }, [pathname, navigationItems]);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
  };

  /**
   * Handle language change - CLIENT-SIDE ONLY (No page reload!)
   * Professional approach: instant UI update using React Context
   */
  const handleLanguageChange = (newLocale) => {
    changeLanguage(newLocale);
    setShowLangDropdown(false);
  };

  /**
   * Get user display name based on role
   */
  const getUserDisplayName = () => {
    if (user?.name) return user.name;

    // Translate role-based default names
    const roleNames = {
      admin:
        t("dashboard.admin.title")
          .replace("Tableau de Bord ", "")
          .replace("Dashboard", "")
          .trim() || "Admin",
      user:
        t("dashboard.client.title")
          .replace("Tableau de Bord ", "")
          .replace("Dashboard", "")
          .trim() || "User",
      partner:
        t("dashboard.partner.title")
          .replace("Tableau de Bord ", "")
          .replace("Dashboard", "")
          .trim() || "Partner",
    };

    return roleNames[user?.role] || "User";
  };

  /**
   * Render sidebar content
   */
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex  items-center justify-between lg:justify-center gap-1 mt-1  border-b border-gray-700/50 px-6">
        <Link className="flex items-center " href={`/${locale}`}>
          <div className="flex items-center justify-center rounded-full -my-3">
            <img src="/logo.png" alt="Logo" className="w-[85px] h-[85px]" />
          </div>
          {/* <div className='flex-1 min-w-0'>
          <p className='text-base font-semibold text-gray-400 capitalize'>
            {t(`dashboard.${role}.title`)}
          </p>
        </div> */}
        </Link>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);
            const fullHref = `/${locale}${item.href}`;

            // If item has children render expandable group
            if (item.children && item.children.length > 0) {
              const isExpanded = expandedMenu === item.key;
              // Check if any child is active
              const hasActiveChild = item.children.some((child) => {
                const [childPath] = child.href.split("?");
                return isActiveLink(childPath);
              });
              const parentActive = isActive || hasActiveChild;

              // Handler for parent click - navigate to first child and expand
              const handleParentClick = () => {
                if (!isExpanded) {
                  // Expand the menu
                  setExpandedMenu(item.key);
                  // Navigate to first child
                  if (item.children && item.children.length > 0) {
                    const firstChildHref = `/${locale}${item.children[0].href}`;
                    router.push(firstChildHref);
                  }
                } else {
                  // Collapse the menu
                  setExpandedMenu(null);
                }
              };

              return (
                <li key={item.href} className="">
                  <button
                    type="button"
                    onClick={handleParentClick}
                    aria-expanded={isExpanded}
                    className={`
                      group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-left
                      transition-all duration-200 ease-in-out
                      ${
                        parentActive
                          ? "bg-[#1E3A5F] text-white shadow-sm"
                          : "text-gray-300 hover:bg-[#1A2B42] hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        parentActive
                          ? "text-[#E6B325]"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    />
                    <span className="flex-1 truncate">{t(item.key)}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      } text-gray-400`}
                    />
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 space-y-1 pl-10">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        // Support child hrefs with optional query params like ?tab=listing-submissions
                        const [childPath, childQuery] = child.href.split("?");
                        const expectedTab = childQuery
                          ? new URLSearchParams(childQuery).get("tab")
                          : null;
                        const pathActive = isActiveLink(childPath);
                        const tabActive = expectedTab
                          ? searchParams
                            ? searchParams.get("tab") === expectedTab
                            : false
                          : true;
                        const childActive = pathActive && tabActive;
                        const childHref = `/${locale}${child.href}`;

                        return (
                          <li key={child.href}>
                            <Link
                              href={childHref}
                              className={`
                                group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                transition-all duration-200 ease-in-out
                                ${
                                  childActive
                                    ? "bg-[#183044] text-white"
                                    : "text-gray-300 hover:bg-[#122033] hover:text-white"
                                }
                              `}
                            >
                              <ChildIcon
                                className={`h-4 w-4 shrink-0 ${
                                  childActive
                                    ? "text-[#E6B325]"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="flex-1 truncate">
                                {t(child.key)}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={fullHref}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-[#1E3A5F] text-white shadow-sm"
                        : "text-gray-300 hover:bg-[#1A2B42] hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-5 w-5 shrink-0 transition-colors
                      ${
                        isActive
                          ? "text-[#E6B325]"
                          : "text-gray-400 group-hover:text-gray-300"
                      }
                    `}
                  />
                  <span className="flex-1 truncate">{t(item.key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4">
        {/* User Info with Dropdown */}
        <div className="relative z-50" ref={dropdownRef}>
          {/* <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className='mb-3 flex w-full items-center gap-3 rounded-lg bg-[#1A2B42] px-3 py-2.5 hover:bg-[#1E3A5F] transition-colors'
          >
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6B325] text-sm font-semibold text-[#0F1B2E]'>
              {user?.name?.charAt(0) || getUserDisplayName().charAt(0)}
            </div>
            <div className='flex-1 min-w-0 text-left'>
              <p className='truncate text-sm font-medium text-white'>
                {getUserDisplayName()}
              </p>
              <p className='truncate text-xs text-gray-400'>
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                showLangDropdown ? 'rotate-180' : ''
              }`}
            />
          </button> */}

          {/* Language Dropdown */}
          {/* {showLangDropdown && (
            <div className='absolute bottom-full left-0 right-0 mb-2 bg-[#1A2B42] rounded-lg shadow-xl border border-gray-700/50 z-50'>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  locale === 'en'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'text-gray-300 hover:bg-[#1E3A5F] hover:text-white'
                }`}
              >
                <Globe className='h-4 w-4 shrink-0' />
                <span>English</span>
                {locale === 'en' && (
                  <span className='ml-auto text-[#E6B325]'>✓</span>
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  locale === 'fr'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'text-gray-300 hover:bg-[#1E3A5F] hover:text-white'
                }`}
              >
                <Globe className='h-4 w-4 shrink-0' />
                <span>Français</span>
                {locale === 'fr' && (
                  <span className='ml-auto text-[#E6B325]'>✓</span>
                )}
              </button>
            </div>
          )} */}
        </div>

        {/* Logout Button */}
        {/* <button
          onClick={handleLogout}
          className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#1A2B42] hover:text-white'
          aria-label='Logout'
        >
          <LogOut className='h-5 w-5 shrink-0 text-gray-400' />
          <span>{t('dashboard.logout')}</span>
        </button> */}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button - Perfectly centered with header */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-3.5 left-4 z-50 lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F1B2E] text-white shadow-md hover:bg-[#1A2B42] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar - Hidden on mobile, visible on lg+ */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 bg-[#0F1B2E] overflow-visible">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar - Slide in from left */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 bg-[#0F1B2E] transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
