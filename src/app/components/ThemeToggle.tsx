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
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
        className="rounded-full p-2 hover:bg-muted transition-colors"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>

      <button
        onClick={() => setTheme("system")}
        aria-label="Use system theme"
        className="rounded-full p-2 hover:bg-muted transition-colors"
      >
        <Laptop />
      </button>
    </div>
  );
}
