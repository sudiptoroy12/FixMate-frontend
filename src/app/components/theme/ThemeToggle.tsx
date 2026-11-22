
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="box-border inline-flex h-10 w-10 min-h-10 min-w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#B7E4C1] bg-[#E8F5E9] text-[#16803D] transition-all duration-200 hover:border-[#65A875] hover:bg-[#D1F0D8] hover:text-[#11632F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65A875] focus-visible:ring-offset-2 dark:border-[#355B40] dark:bg-[#1C3022] dark:text-[#A3E6B1] dark:hover:border-[#65A875] dark:hover:bg-[#294532] dark:hover:text-[#D1F5D8] dark:focus-visible:ring-[#65A875] dark:focus-visible:ring-offset-[#142219]"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {mounted ? (
          isDark ? (
            <Sun size={19} strokeWidth={2} />
          ) : (
            <Moon size={19} strokeWidth={2} />
          )
        ) : (
          <span className="block h-[19px] w-[19px]" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
