"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Header from "./components/Header";
export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return (<>
      <Header/>
        <main className="flex mt-4 rounded-full border-gray-400 border-dashed m-10 p-10">
          <p className="text-black">Not signed in</p>
          <button onClick={() => signIn("github")}>
          Sign in with Github</button>
          </main>
        
    </>);
  }

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
