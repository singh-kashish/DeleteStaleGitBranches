// src/app/api/github/repos/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://api.github.com/user/repos?per_page=200", {
    headers: { Authorization: `token ${token}` },
  });

  const repos = await res.json();
  return NextResponse.json(repos);
}
