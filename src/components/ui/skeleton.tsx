import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

// Hero section skeleton for featured article
export function HeroSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Image skeleton */}
      <div className="relative aspect-4/3 lg:aspect-square overflow-hidden rounded-2xl">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-4/5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}

// Grid of article cards skeleton
export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-16/10 w-full rounded-xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stat card skeleton for dashboard
export function StatCardSkeleton() {
  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

// Full dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Recent articles */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-5 w-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Media grid skeleton
export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}

// Category page skeleton
export function CategoryPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="max-w-2xl">
        <Skeleton className="w-12 h-1 rounded-full mb-4" />
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4 mt-2" />
      </div>
      {/* Grid */}
      <ArticleGridSkeleton count={6} />
    </div>
  );
}

// Article page skeleton
export function ArticlePageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Category */}
      <Skeleton className="h-7 w-24 rounded-full mb-6" />
      {/* Title */}
      <div className="space-y-3 mb-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>
      {/* Excerpt */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
      {/* Author & Date */}
      <div className="flex items-center gap-6 pb-8 mb-8 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Featured Image */}
      <Skeleton className="w-full aspect-video rounded-xl mb-10" />
      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full mt-6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full mt-6" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  );
}

// Article editor skeleton for admin
export function ArticleEditorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      {/* Editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
