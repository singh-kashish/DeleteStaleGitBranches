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
    <header className="flex flex-row justify-between items-center p-6 m-10 border-b-2 border-gray-500">
      <Link href="/">
      <div className="flex items-center gap-4">
        <Image src={favicon} alt="Logo" width={48} height={48} className="rounded-full pr-2" />
        <h1 className="text-2xl font-bold">GitHub Delete Stale Branches</h1>
      </div>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {session ? (
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="!px-6 !py-3 w-fit inline-flex items-center justify-center !rounded-2xl !cursor-pointer !hover:bg-orange-600 hover:text-white transition-colors duration-200"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => signIn("github")}
            className="!px-6 !py-3 w-fit inline-flex items-center justify-center rounded-xl cursor-pointer hover:bg-green-600 transition-colors duration-200"
          >
            Sign In
          </Button>
        )}

      </div>
    </header>
  );
}
