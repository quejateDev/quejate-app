"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PQRSkeleton() {
  return (
    <div className="md:block">
      <div className="hidden md:block">
        <Card>
          <div className="p-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <CardContent>
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* Custom fields skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              
              {/* Attachments skeleton */}
              <div className="mt-4">
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              
              {/* Actions skeleton */}
              <div className="mt-4 flex items-center space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mobile skeleton */}
      <div className="md:hidden border-b border-gray-300 pb-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>
        
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="mt-4 mb-2">
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
} 