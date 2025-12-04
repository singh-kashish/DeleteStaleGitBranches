"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Header from "./components/Header";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return (
      <>
        <Header />
        <main className="flex flex-col m-10 p-10 border-2 border-dashed border-gray-400 rounded-2xl items-center gap-4">
          <p className="text-xl font-medium">Not signed in</p>
         <button
          type="button"
          onClick={() => signIn("github")}
          className="px-6 py-3 bg-black text-white rounded-xl inline-flex items-center justify-center cursor-pointer hover:bg-green-400 transition-colors duration-200"
        >
          Sign in with GitHub
        </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="p-10">
        <p className="text-xl font-medium mb-6">Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Sign out
        </button>
      </main>
    </>
  );
}
