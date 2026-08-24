"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-white/[0.04]",
        className
      )}
    />
  );
}

/** Dashboard stat card skeleton */
export function StatCardSkeleton() {
  return (
    <div className="bg-[#12121a] rounded-xl p-5 border border-white/8">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
      <Skeleton className="h-7 w-16 rounded mb-2" />
      <Skeleton className="h-3 w-24 rounded" />
    </div>
  );
}

/** Project row skeleton */
export function ProjectRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-48 rounded mb-2" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
      <Skeleton className="h-5 w-12 rounded-full" />
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  );
}

/** Output tab skeleton */
export function OutputTabSkeleton() {
  return (
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-9 w-28 rounded-xl" />
      ))}
    </div>
  );
}

/** Content preview skeleton */
export function ContentSkeleton() {
  return (
    <div className="bg-[#12121a] rounded-2xl overflow-hidden border border-white/8">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-11/12 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-5/6 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
        <div className="pt-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded mt-2" />
          <Skeleton className="h-3.5 w-full rounded mt-2" />
        </div>
      </div>
    </div>
  );
}

/** Full page skeleton for initial load */
export function DashboardSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-64 rounded mb-2" />
        <Skeleton className="h-4 w-48 rounded" />
      </div>

      {/* CTA Card */}
      <div className="bg-[#12121a] rounded-2xl p-8 mb-8 border border-white/8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-3 w-32 rounded mb-3" />
            <Skeleton className="h-6 w-56 rounded mb-2" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <Skeleton className="h-12 w-48 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent list */}
      <div className="bg-[#12121a] rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <ProjectRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Processing screen skeleton */
export function ProcessingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <Skeleton className="w-20 h-20 rounded-2xl mx-auto mb-6" />
      <Skeleton className="h-7 w-56 rounded mx-auto mb-3" />
      <Skeleton className="h-4 w-72 rounded mx-auto mb-8" />

      <div className="bg-[#12121a] rounded-2xl p-6 border border-white/8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
