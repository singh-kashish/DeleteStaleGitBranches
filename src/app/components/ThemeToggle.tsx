"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4 rounded-xl p-4">
      {/* Light / Dark Toggle */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
        className="rounded-full p-3 hover:bg-green-200 transition cursor-pointer hover:text-black"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>

      {/* System theme */}
      <button
        onClick={() => setTheme("system")}
        aria-label="Use system theme"
        className="rounded-full p-3 hover:bg-green-200 transition cursor-pointer hover:text-black"
      >
        <Laptop />
      </button>
    </div>
  );
}
