import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export const StampCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="aspect-square relative bg-muted/10">
      <Skeleton className="w-full h-full" />
      <div className="absolute top-2 left-2">
        <Skeleton className="h-5 w-12 rounded" />
      </div>
    </div>
    <div className="p-3 space-y-2">
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  </Card>
)

export const StampListSkeleton = () => (
  <Card className="mb-3">
    <CardContent className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </CardContent>
  </Card>
)

export const GroupCardSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-32" />
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
  </Card>
)

export const LoadingStamps = ({ count = 6, type = 'grid' }: { count?: number; type?: 'grid' | 'list' | 'groups' }) => (
  <div className="space-y-6">
    <div className={cn(
      type === 'grid' 
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        : type === 'list'
        ? "space-y-3"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    )}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {type === 'grid' ? <StampCardSkeleton /> : 
           type === 'list' ? <StampListSkeleton /> : 
           <GroupCardSkeleton />}
        </div>
      ))}
    </div>
    <div className="text-center py-6">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    </div>
  </div>
) 
