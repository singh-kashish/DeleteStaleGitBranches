import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust if path differs

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "owner and repo are required" },
      { status: 400 }
    );
  }

  /**
   * TEMP IMPLEMENTATION
   * (Later replaced by MCP GitHub tool)
   */
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const branches = await res.json();

  const enriched = branches.map((b: any) => ({
    name: b.name,
    lastCommitDate: new Date().toISOString(), // placeholder
    staleDays: Math.floor(Math.random() * 300), // placeholder
  }));

  // Sort: MOST STALE FIRST
  enriched.sort((a: any, b: any) => b.staleDays - a.staleDays);

  return NextResponse.json(enriched);
}
