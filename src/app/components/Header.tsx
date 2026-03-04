"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import favicon from "../favicon.ico";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background text-text border-b border-border transition-colors">
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image
            src={favicon}
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold">
            GitHub Delete Stale Branches
          </h1>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {session ? (
          <Button
            onClick={() => signOut()}
            className="bg-primary text-white hover:opacity-90 transition"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => signIn("github")}
            className="bg-primary text-white hover:opacity-90 transition"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
