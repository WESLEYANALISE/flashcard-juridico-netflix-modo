
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto relative px-[9px]">
      <div className="w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl sm:rounded-3xl border border-neutral-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-neutral-800/80 to-neutral-700/60 border-b border-neutral-600/30 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-center">
              <Skeleton className="h-12 w-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700/50 shadow-xl">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}
