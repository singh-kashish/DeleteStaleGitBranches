import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://api.github.com/user/repos?per_page=100", {
    headers: {
      Authorization: `Bearer ${(session as any).accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub error" }, { status: 500 });
  }

  const repos = await res.json();
  return NextResponse.json(repos);
}
