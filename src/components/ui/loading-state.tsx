import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic page skeleton — renders immediately, no spinner flash.
 * Matches the rough shape of most content pages.
 */
export function LoadingState() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Card row */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main content block */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-40" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for the content/video detail page.
 */
export function ContentLoadingState() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6 animate-pulse">
      {/* Video placeholder */}
      <Skeleton className="w-full rounded-xl" style={{ paddingBottom: "40.25%", height: 0, display: "block" }} />
      {/* Title + badges */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      {/* Tabs */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton for the module detail page.
 */
export function ModuleLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Module header card */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      {/* Content list */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
