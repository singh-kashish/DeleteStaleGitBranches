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
    <div className="flex items-center gap-4 rounded-xl bg-lime-600 p-4">
      {/* Light / Dark Toggle */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
        className="rounded-full p-3 hover:bg-lime-800 transition cursor-pointer"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>

      {/* System theme */}
      <button
        onClick={() => setTheme("system")}
        aria-label="Use system theme"
        className="rounded-full p-3 hover:bg-lime-800 transition cursor-pointer"
      >
        <Laptop />
      </button>
    </div>
  );
}
