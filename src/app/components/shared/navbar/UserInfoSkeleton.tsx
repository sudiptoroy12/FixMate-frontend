
import { ChevronDown } from "lucide-react";

const UserInfoSkeleton = () => {
  return (
    <div
      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 pr-3 sm:gap-2.5"
      aria-label="Loading user information"
      role="status"
    >
      {/* Avatar skeleton */}
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-[#183a31]">
        <div className="h-full w-full animate-pulse rounded-xl bg-[#b9e769]/20" />
      </div>

      {/* Name skeleton */}
      <div className="hidden space-y-2 sm:block">
        <div className="h-3.5 w-24 animate-pulse rounded-md bg-white/20" />
      </div>

      {/* Dropdown arrow skeleton */}
      <ChevronDown
        size={16}
        className="text-gray-400"
        aria-hidden="true"
      />
    </div>
  );
};

export default UserInfoSkeleton;
