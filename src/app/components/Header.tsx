"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import favicon from "../favicon.ico";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex flex-row justify-between items-center p-6 m-10 border-b-2 border-gray-500">
      <div className="flex items-center gap-4">
        <Image src={favicon} alt="Logo" width={48} height={48} className="rounded-full pr-2" />
        <h1 className="text-2xl font-bold">GitHub Delete Stale Branches</h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {session ? (
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        ) : (
          <Button variant="default" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
