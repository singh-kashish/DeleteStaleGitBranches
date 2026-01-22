"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Header from "./components/Header";
import RepoList from "./components/RepoList";
import Image from "next/image";
import { P } from "./components/utils/utils";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  if (!session) {
    return (
      <>
        <Header />
        <main className="flex flex-col m-4 p-2 bg-[#151B23] border-2 border-dashed border-gray-400 rounded-2xl items-center gap-4 min-h-full">
          <P style="text-xl font-medium" text="Not signed in"/><p className="text-xl font-medium">Not signed in</p>
         <button
          type="button"
          onClick={() => signIn("github")}
          className="px-6 py-3 bg-[#151B23] text-white rounded-xl inline-flex items-center justify-center cursor-pointer hover:bg-green-400 transition-colors duration-200 border-2 hover:border-yellow-100"
        >
          Sign in with GitHub
        </button>
        </main>
      </>
    );
  }
  console.log(session.user);
  return (
    <>
      <Header />
      <main className="flex flex-col m-8 p-2 border-2  border-gray-400 rounded-2xl justify-start items-start gap-4 h-full">
        <div className="bg-[#151B23] w-full text-start rounded-lg flex items-end mb-2 pb-2">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              width={30}
              height={30}
                alt="User profile picture"
              className="rounded-3xl"
            />
          )}
          <P text={`Signed in as ${session?.user?.name}`} style="text-xl font-medium ml-2"/>
          
            </div>
        <RepoList/>
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
