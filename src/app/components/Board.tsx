// // src/components/Board.tsx
// 'use client';  // Mark this component as a client-side component

// import { useSession } from "next-auth/react";  // Import useSession for client-side session
// import Link from "next/link";

// interface BoardProps {
//   session: any;  // Accept session as a prop
// }

// export const Board = ({ session }: BoardProps) => {
//   const { data: clientSession, status } = useSession();  // Use session from the client

//   // Use session passed from server-side or fallback to client-side session
//   const userSession = session || clientSession;

//   // If the session is loading or not available
//   if (status === "loading" || !userSession) {
//     return (
//       <p>
//         You are not logged in. <Link href="/api/auth/signin">Login to GitHub</Link>
//       </p>
//     );
//   }

//   return (
//     <main>
//       <h1>Welcome, {userSession.user?.name}</h1>
//       <p>Email: {userSession.user?.email}</p>
//       <p>GitHub Username: {userSession.githubProfile?.login}</p>
//       <img src={userSession.githubProfile?.avatar_url} alt="Profile Image" />
//     </main>
//   );
// };
// app/page.tsx (example usage)
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
const session = await getServerSession(authOptions);

export default function Page() {
  const { data: session, status } = useSession();
  const session = await getServerSession(authOptions);

  if (status === "loading") {
    return <p>Loading…</p>;
  }

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
