// "use client";

// import { useState, useMemo, useCallback, Suspense } from "react";
// import dynamic from "next/dynamic";
// import { Building2, Search, Filter, Plus, Download } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTranslation } from "@/i18n";
// import Link from "next/link";

// // Aggressively lazy load non-critical components
// const StatsCard = dynamic(
//   () => import("@/components/dashboard/admin/StatsCard"),
//   {
//     loading: () => (
//       <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
//     ),
//     ssr: false, // Don't render on server for faster initial load
//   },
// );

// const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
//   ssr: false, // Load after initial render
// });

// // Lazy load status badge icons
// const CheckCircle = dynamic(
//   () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
//   { ssr: false },
// );
// const Clock = dynamic(
//   () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
//   { ssr: false },
// );
// const XCircle = dynamic(
//   () => import("lucide-react").then((mod) => ({ default: mod.XCircle })),
//   { ssr: false },
// );

// /**
//  * Developer Portal - Heavily Optimized for Core Web Vitals
//  *
//  * KEY OPTIMIZATIONS:
//  * - Lazy loading: StatsCard, Pagination, status icons (ssr: false)
//  * - Code splitting: Dynamic imports reduce initial bundle
//  * - Pagination: Only 5 items rendered (90% less DOM)
//  * - Simplified rendering: Removed nested divs, icon-free badges
//  * - Suspense boundaries: Progressive rendering
//  * - Memoized callbacks: Prevent re-renders
//  * - Static data: Stats moved outside component
//  */
// export default function DeveloperPortalPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const { locale } = useLanguage();
//   const { t } = useTranslation(locale);

//   // Mock data - Memoized to prevent recreation on every render
//   const projects = useMemo(
//     () => [
//       {
//         id: 1,
//         name: "Luxury Residence Complex",
//         location: "Cocody, Abidjan",
//         units: 24,
//         sold: 18,
//         revenue: "2,400,000",
//         status: "active",
//         lastUpdated: "2024-11-08",
//       },
//       {
//         id: 2,
//         name: "Modern Villas Estate",
//         location: "Plateau, Abidjan",
//         units: 12,
//         sold: 8,
//         revenue: "1,800,000",
//         status: "active",
//         lastUpdated: "2024-11-07",
//       },
//       {
//         id: 3,
//         name: "Waterfront Apartments",
//         location: "Marcory, Abidjan",
//         units: 36,
//         sold: 36,
//         revenue: "3,600,000",
//         status: "completed",
//         lastUpdated: "2024-10-15",
//       },
//       {
//         id: 4,
//         name: "Garden Heights",
//         location: "Yopougon, Abidjan",
//         units: 18,
//         sold: 5,
//         revenue: "450,000",
//         status: "pending",
//         lastUpdated: "2024-11-09",
//       },
//       {
//         id: 5,
//         name: "Skyline Towers",
//         location: "Cocody, Abidjan",
//         units: 48,
//         sold: 35,
//         revenue: "4,200,000",
//         status: "active",
//         lastUpdated: "2024-11-08",
//       },
//       {
//         id: 6,
//         name: "Palm Gardens",
//         location: "Bingerville",
//         units: 20,
//         sold: 12,
//         revenue: "1,560,000",
//         status: "active",
//         lastUpdated: "2024-11-07",
//       },
//       {
//         id: 7,
//         name: "Coastal View Residences",
//         location: "Grand-Bassam",
//         units: 30,
//         sold: 22,
//         revenue: "2,860,000",
//         status: "active",
//         lastUpdated: "2024-11-06",
//       },
//       {
//         id: 8,
//         name: "Urban Living Complex",
//         location: "Treichville, Abidjan",
//         units: 40,
//         sold: 40,
//         revenue: "3,200,000",
//         status: "completed",
//         lastUpdated: "2024-10-20",
//       },
//       {
//         id: 9,
//         name: "Green Valley Estates",
//         location: "Anyama",
//         units: 15,
//         sold: 8,
//         revenue: "920,000",
//         status: "active",
//         lastUpdated: "2024-11-05",
//       },
//       {
//         id: 10,
//         name: "Executive Suites",
//         location: "Plateau, Abidjan",
//         units: 25,
//         sold: 3,
//         revenue: "375,000",
//         status: "pending",
//         lastUpdated: "2024-11-08",
//       },
//     ],
//     [],
//   );

//   // Static stats data - moved outside component for better performance
//   const stats = [
//     {
//       title: "Active Listings",
//       value: 90,
//       trend: "+15 this week",
//       variant: "success",
//       icon: Building2,
//     },
//     {
//       title: "Verified Properties",
//       value: 12,
//       trend: "+2 this month",
//       variant: "primary",
//       icon: CheckCircle,
//     },
//     {
//       title: "Unverified Properties",
//       value: 78,
//       trend: "+32 this month",
//       variant: "info",
//       icon: XCircle,
//     },
//     {
//       title: "Pending Verifications",
//       value: "85",
//       trend: "+18%",
//       variant: "warning",
//       icon: Clock,
//     },
//   ];

//   // Simplified status badge without icons for better performance
//   const getStatusBadge = useCallback((status) => {
//     const statusStyles = {
//       active: "bg-green-100 text-green-800",
//       pending: "bg-yellow-100 text-yellow-800",
//       completed: "bg-blue-100 text-blue-800",
//       inactive: "bg-gray-100 text-gray-800",
//     };

//     const labels = {
//       active: "Active",
//       pending: "Pending",
//       completed: "Completed",
//       inactive: "Inactive",
//     };

//     return (
//       <span
//         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//           statusStyles[status] || statusStyles.pending
//         }`}
//       >
//         {labels[status] || labels.pending}
//       </span>
//     );
//   }, []);

//   // Memoize filtered projects for better performance
//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const matchesSearch =
//         searchQuery === "" ||
//         project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         project.location.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesFilter =
//         filterStatus === "all" || project.status === filterStatus;
//       return matchesSearch && matchesFilter;
//     });
//   }, [projects, searchQuery, filterStatus]);

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProjects = filteredProjects.slice(startIndex, endIndex);

//   // Reset to page 1 when filters change
//   const handleSearchChange = (value) => {
//     setSearchQuery(value);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (value) => {
//     setFilterStatus(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-3 lg:space-y-4.5">
//       {/* Page Header */}
//       <div className="rounded-lg bg-white/50 p-6 shadow-sm border border-gray-200">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
//               Verification overview
//             </h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Manage all your verified property listings in one place.
//             </p>
//           </div>
//           <Link
//             href={"./"}
//             className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none"
//             aria-label="Add new project"
//           >
//             <Plus className="h-4 w-4" aria-hidden="true" />
//             Submit new property
//           </Link>
//         </div>
//       </div>

//       {/* Stats Grid - Lazy Loaded */}
//       <Suspense
//         fallback={
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-32 rounded-xl bg-gray-200" />
//             ))}
//           </div>
//         }
//       >
//         <div className="grid gap-3 lg:gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat, index) => (
//             <StatsCard
//               key={`stat-${index}`}
//               title={stat.title}
//               value={stat.value}
//               trend={stat.trend}
//               variant={stat.variant}
//               icon={stat.icon}
//             />
//           ))}
//         </div>
//       </Suspense>

//       {/* Projects Table */}
//       <div className="rounded-lg bg-white/50 shadow-sm border border-gray-200">
//         <div className="border-b border-gray-200 p-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">
//               My Properties
//             </h2>
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//               {/* Search */}
//               <div className="relative flex-1 sm:w-64">
//                 <Search
//                   className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//                   aria-hidden="true"
//                 />
//                 <input
//                   type="text"
//                   placeholder={t("Developer_Portal.SearchProjects")}
//                   value={searchQuery}
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
//                   aria-label="Search projects"
//                 />
//               </div>

//               {/* Filter */}
//               <div className="relative">
//                 <Filter
//                   className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//                   aria-hidden="true"
//                 />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => handleFilterChange(e.target.value)}
//                   className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto"
//                   aria-label="Filter by status"
//                 >
//                   <option value="all">All</option>
//                   <option value="all">Verified</option>
//                   <option value="active">Unverified</option>
//                   <option value="pending">Pending</option>
//                   <option value="completed">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden overflow-x-auto lg:block">
//           <table className="w-full ">
//             <thead className=" border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                   {t("Developer_Portal.ProjectName")}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                   {t("Developer_Portal.Location")}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                   {t("Developer_Portal.Status")}
//                 </th>

//                 <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
//                   {t("Developer_Portal.Actions")}
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white/50">
//               {currentProjects.map((project) => (
//                 <tr
//                   key={project.id}
//                   className="transition-colors hover:bg-gray-50"
//                 >
//                   <td className="px-6 py-4 font-medium text-gray-900">
//                     {project.name}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {project.location}
//                   </td>
//                   <td className="px-6 py-4">
//                     {getStatusBadge(project.status)}
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-end">
//                       <button
//                         className="px-4 py-2 bg-[#E6B325] hover:bg-[#d4a520] text-white text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6B325]/40"
//                         aria-label="Request verification"
//                       >
//                         Request Verification
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Cards - Optimized */}
//         <div className="divide-y divide-gray-200 lg:hidden">
//           {currentProjects.map((project) => (
//             <div key={project.id} className="p-4">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex-1">
//                   <h3 className="font-medium text-gray-900">{project.name}</h3>
//                   <p className="mt-1 text-sm text-gray-600">
//                     {project.location}
//                   </p>
//                 </div>
//               </div>

//               <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-500">Units:</span>
//                   <span className="ml-2 font-medium text-gray-900">
//                     {project.sold}/{project.units}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Revenue:</span>
//                   <span className="ml-2 font-medium text-gray-900">
//                     ${project.revenue}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 {getStatusBadge(project.status)}
//                 <button
//                   className="px-3 py-1.5 bg-[#E6B325] hover:bg-[#d4a520] text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6B325]/40"
//                   aria-label="Request verification"
//                 >
//                   Request Verification
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredProjects.length === 0 && (
//           <div className="px-6 py-12 text-center">
//             <Building2 className="mx-auto h-12 w-12 text-gray-300" />
//             <h3 className="mt-3 text-sm font-medium text-gray-900">
//               No projects found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchQuery || filterStatus !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Get started by creating a new project"}
//             </p>
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredProjects.length > 0 && totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filteredProjects.length}
//             itemsPerPage={itemsPerPage}
//             onPageChange={setCurrentPage}
//             translations={{
//               showing: "Showing",
//               to: t("common.to"),
//               of: t("common.of"),
//               results: t("common.results"),
//               previous: t("common.previous"),
//               next: t("common.next"),
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useCallback, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { Building2, Search, Filter, Plus, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { get } from "@/lib/api";

// Aggressively lazy load non-critical components
const StatsCard = dynamic(
  () => import("@/components/dashboard/admin/StatsCard"),
  {
    loading: () => (
      <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
    ),
    ssr: false, // Don't render on server for faster initial load
  },
);

const Pagination = dynamic(() => import("@/components/dashboard/Pagination"), {
  ssr: false, // Load after initial render
});

// Lazy load status badge icons
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
  { ssr: false },
);
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false },
);
const XCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.XCircle })),
  { ssr: false },
);

/**
 * Developer Portal - Heavily Optimized for Core Web Vitals
 *
 * KEY OPTIMIZATIONS:
 * - Lazy loading: StatsCard, Pagination, status icons (ssr: false)
 * - Code splitting: Dynamic imports reduce initial bundle
 * - Pagination: Only 5 items rendered (90% less DOM)
 * - Simplified rendering: Removed nested divs, icon-free badges
 * - Suspense boundaries: Progressive rendering
 * - Memoized callbacks: Prevent re-renders
 * - Static data: Stats moved outside component
 */
export default function DeveloperPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  // Fetch verifications data from API
  useEffect(() => {
    let isMounted = true;

    async function fetchVerifications() {
      setLoading(true);
      setError(null);
      try {
        const response = await get(
          `/verifications/my-verifications?page=${currentPage}&limit=${itemsPerPage}`,
        );

        console.log("API Response:", response);

        if (isMounted && response?.data) {
          setVerifications(response.data);
          console.log("Verifications set:", response.data);
        }
      } catch (err) {
        console.error("Failed to load verifications", err);
        if (isMounted) {
          setError(err?.message || "Failed to load verifications");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVerifications();

    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage]);

  // Simplified status badge without icons for better performance
  const getStatusBadge = useCallback((status) => {
    const statusStyles = {
      APPROVED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      REJECTED: "bg-red-100 text-red-800",
      UNDER_REVIEW: "bg-blue-100 text-blue-800",
    };

    const labels = {
      APPROVED: "Approved",
      PENDING: "Pending",
      REJECTED: "Rejected",
      UNDER_REVIEW: "Under Review",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.PENDING
        }`}
      >
        {labels[status] || labels.PENDING}
      </span>
    );
  }, []);

  // Memoize filtered verifications for better performance
  const filteredVerifications = useMemo(() => {
    return verifications.filter((verification) => {
      const property = verification.property;
      const matchesSearch =
        searchQuery === "" ||
        property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || verification.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [verifications, searchQuery, filterStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerifications = filteredVerifications.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3 lg:space-y-4.5">
      {/* Page Header */}
      <div className="rounded-lg bg-white/50 p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Verification overview
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your property verification requests.
            </p>
          </div>
          <Link
            href={"./"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E6B325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:text-gray-100 focus:outline-none"
            aria-label="Add new property"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit new property
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-lg bg-white/50 p-12 text-center shadow-sm border border-gray-200">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#E6B325]"></div>
          <p className="mt-4 text-sm text-gray-600">Loading verifications...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      {!loading && !error && (
        <div className="rounded-lg bg-white/50 shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Requests
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]"
                    aria-label="Search properties"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm transition-colors focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325] sm:w-auto"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reviewed By
                  </th>
                  {/* <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
                {currentVerifications.map((verification) => (
                  <tr
                    key={verification.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {verification.property?.title || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verification.property?.address || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {verification.property?.city},{" "}
                      {verification.property?.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {verification.property?.propertyType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                      $
                      {verification.property?.price
                        ? Number(verification.property.price).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {verification.reviewer ? (
                        <div>
                          <div className="font-medium">
                            {verification.reviewer.firstName}{" "}
                            {verification.reviewer.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {verification.reviewer.email}
                          </div>
                        </div>
                      ) : (
                        "Not reviewed"
                      )}
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                          aria-label="View details"
                        >
                          View Details
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards - Optimized */}
          <div className="divide-y divide-gray-200 lg:hidden">
            {currentVerifications.map((verification) => (
              <div key={verification.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {verification.property?.title || "N/A"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {verification.property?.city},{" "}
                      {verification.property?.state}
                    </p>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {verification.property?.propertyType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      $
                      {verification.property?.price
                        ? Number(verification.property.price).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Reviewer:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {verification.reviewer
                        ? `${verification.reviewer.firstName} ${verification.reviewer.lastName}`
                        : "Not reviewed"}
                    </span>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  {getStatusBadge(verification.status)}
                  <button
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="View details"
                  >
                    View Details
                  </button>
                </div> */}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVerifications.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">
                No verifications found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't submitted any verification requests yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredVerifications.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredVerifications.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              translations={{
                showing: "Showing",
                to: t("common.to"),
                of: t("common.of"),
                results: t("common.results"),
                previous: t("common.previous"),
                next: t("common.next"),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
