import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * TEMP: Direct GitHub call
     * MCP will replace this later
     */
    const res = await fetch(
      "https://api.github.com/user/repos?per_page=200",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text },
        { status: res.status }
      );
    }

    const repos = await res.json();
    return NextResponse.json(repos);
  } catch (err) {
    console.error("Repos API error:", err);
    return NextResponse.json(
      { error: "Failed to load repositories" },
      { status: 500 }
    );
  }
}
