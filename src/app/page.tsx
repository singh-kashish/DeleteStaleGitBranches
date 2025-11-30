"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Header from "./components/Header";
export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return (<>
      <Header/>
        <p className="text-black">Not signed in</p>
        <button onClick={() => signIn("github")}>Sign in with Github</button>
    </>);
  }

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
