"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Login with GitHub
      </button>
    </div>
  );
}
