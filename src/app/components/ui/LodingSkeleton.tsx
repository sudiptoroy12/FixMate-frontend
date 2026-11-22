
interface SkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  );
}
