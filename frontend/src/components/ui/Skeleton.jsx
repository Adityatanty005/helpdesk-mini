import React from "react";

export function Skeleton({ className = "h-4 w-full" }) {
  return <div className={"animate-pulse rounded-md bg-gray-200/70 " + className} />;
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}
