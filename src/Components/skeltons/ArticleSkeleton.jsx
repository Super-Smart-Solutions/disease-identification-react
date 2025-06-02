import React from "react";

export function ArticleSkeleton() {
  return (
    <div className="w-full p-6 cardIt space-y-4 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>

      {/* Arabic Name Skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>

      {/* Scientific Name Skeleton */}
      <div className="h-5 bg-gray-200 rounded w-2/3"></div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>

      {/* Expandable Content Skeleton (always visible but will be height:0 in actual loading) */}
      <div className="space-y-3 mt-4">
        {/* Symptoms Skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mt-1"></div>
        </div>

        {/* Treatments Skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5 mt-1"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="pt-2">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}
