import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">

      {/* LEFT SIDE (Image placeholder) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Skeleton className="h-full w-full" />
      </div>

      {/* RIGHT SIDE (Form placeholder) */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Input Fields */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-full rounded-md" />

          {/* Footer Links */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>

        </div>
      </div>
    </div>
  );
}
