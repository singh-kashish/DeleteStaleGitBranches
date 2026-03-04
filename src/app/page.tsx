"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Header from "./components/Header";
import RepoList from "./components/RepoList";
import Image from "next/image";
import { P } from "./components/utils/utils";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-4 text-muted">Loading…</p>;
  }

  if (!session) {
    return (
      <>
        <Header />
        <main className="flex flex-col items-center gap-4 p-6 bg-background text-text min-h-screen transition-colors">
          <div className="w-full max-w-xl bg-muted border border-border rounded-xl p-6 text-center">
            <P text="Not signed in" style="text-xl font-medium" />

            <button
              onClick={() => signIn("github")}
              className="mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Sign in with GitHub
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="p-6 bg-background text-text min-h-screen transition-colors">
        <div className="flex items-center gap-3 mb-6 bg-muted border border-border rounded-lg p-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              width={32}
              height={32}
              alt="Profile"
              className="rounded-full border border-border"
            />
          )}
          <P
            text={`Signed in as ${session.user?.name}`}
            style="text-lg font-medium"
          />
        </div>

        <RepoList />

        <button
          onClick={() => signOut()}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Sign out
        </button>
      </main>
    </>
  );
}
