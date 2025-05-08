import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface Props {
  span?: number;
}

export function AppSkeleton(props: Props) {
  return (
    <>
      {props.span ? (
        Array.from({ length: props.span }, (_, i) => i).map((span) => (
          <div key={span} className="flex flex-col space-y-3 mb-2">
            <Skeleton className="h-[150px] w-full rounded-xl bg-muted/30" />
          </div>
        ))
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[150px] w-full rounded-xl bg-muted" />
        </div>
      )}
    </>
  );
}
