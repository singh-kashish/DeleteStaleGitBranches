"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>You are not signed in</p>
        <button onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}