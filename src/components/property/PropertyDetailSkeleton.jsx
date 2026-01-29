import React from "react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section Skeleton */}
      <div className="relative min-h-[200px] sm:min-h-[480px] w-full rounded-xl overflow-hidden mb-8 bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <Skeleton className="h-8 w-3/4 sm:w-1/2 mb-4 bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600" />
            <Skeleton className="h-4 w-48 bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>
      </div>

      {/* Navigation Bar Skeleton */}
      <div className="sticky top-0 z-40 mb-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl p-4 flex justify-between items-center">
        <div className="hidden lg:flex gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <Skeleton className="h-8 w-8 lg:hidden" /> {/* Mobile Menu Icon */}
        <Skeleton className="h-10 w-32 rounded-lg" /> {/* Button */}
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3.5">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Breadcrumb & Title */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Unit Plans Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-4">
                    <Skeleton className="h-48 w-full rounded-lg mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-7 w-1/3 mb-4" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div>
              <Skeleton className="h-8 w-56 mb-6" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>

             {/* Payment Plan Skeleton */}
             <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                      <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                   </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Development Overview Box */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                <Skeleton className="h-6 w-1/2 mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              {/* Investment Highlights Box */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 mb-4" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSkeleton;
