export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function PlayerCardSkeleton() {
  return (
    <div className="relative bg-bg-secondary border border-border p-8 flex flex-col md:flex-row items-center gap-8">
      <div className="absolute top-0 left-0 right-0 h-1 bg-bg-elevated" />
      <SkeletonBox className="w-36 h-36" />
      <div className="flex-1 w-full space-y-3">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-10 w-72" />
        <SkeletonBox className="h-5 w-48" />
      </div>
      <div className="flex gap-px">
        <SkeletonBox className="h-20 w-28" />
        <SkeletonBox className="h-20 w-28" />
      </div>
    </div>
  );
}

export function RankHistorySkeleton() {
  return (
    <div className="bg-bg-secondary border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-8 w-40" />
        <SkeletonBox className="h-10 w-56" />
      </div>
      <SkeletonBox className="h-60 w-full" />
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="flex items-stretch bg-bg-secondary border border-border">
      <SkeletonBox className="w-2" />
      <div className="flex-1 flex items-center gap-4 p-4">
        <SkeletonBox className="w-16 h-16" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-3 w-24" />
        </div>
        <SkeletonBox className="h-10 w-40" />
        <SkeletonBox className="h-8 w-24" />
      </div>
    </div>
  );
}
