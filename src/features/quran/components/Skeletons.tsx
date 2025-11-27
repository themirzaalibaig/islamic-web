import { Skeleton } from '@/components/ui/skeleton'

export const SurahListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-3 rounded-lg border">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-40 mt-2" />
      </div>
    ))}
  </div>
)

export const SurahHeaderSkeleton = () => (
  <div className="text-center mb-8">
    <Skeleton className="h-6 w-48 mx-auto" />
    <Skeleton className="h-4 w-64 mx-auto mt-2" />
    <Skeleton className="h-4 w-40 mx-auto mt-2" />
    <div className="mt-6 p-4 rounded-lg border">
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  </div>
)

export const VerseListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 rounded-xl border">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-6" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4 mt-3" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    ))}
  </div>
)
