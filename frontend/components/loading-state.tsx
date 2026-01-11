"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingStateProps = {
  rows?: number;
  className?: string;
};

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <Card className={`border shadow-sm ${className || ""}`}>
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
