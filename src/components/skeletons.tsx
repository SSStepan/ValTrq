export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function PlayerCardSkeleton() {
  return (
    <div className="bg-bg-secondary border-l-4 border-bg-tertiary clip-angled p-6 flex flex-col md:flex-row items-center gap-6">
      <SkeletonBox className="w-32 h-32 rounded-sm" />
      <div className="flex-1 w-full space-y-3">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-7 w-64" />
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-3 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBox className="h-16 w-24" />
        <SkeletonBox className="h-16 w-24" />
      </div>
    </div>
  );
}

export function RankHistorySkeleton() {
  return (
    <div className="bg-bg-secondary border border-bg-tertiary p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-3 w-20" />
      </div>
      <SkeletonBox className="h-64 w-full" />
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="flex items-stretch bg-bg-secondary border border-bg-tertiary">
      <SkeletonBox className="w-1.5" />
      <div className="flex-1 flex items-center gap-4 p-4">
        <SkeletonBox className="w-14 h-14 clip-angled-sm" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-24" />
        </div>
        <SkeletonBox className="h-8 w-32" />
        <SkeletonBox className="h-8 w-20" />
      </div>
    </div>
  );
}
