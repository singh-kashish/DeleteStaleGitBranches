import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listReposWithBranches } from "@/lib/mcp/tools/github.listReposWithBranches";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const repos = await listReposWithBranches(session.accessToken);

    return NextResponse.json(repos);
  } catch (err) {
    console.error("❌ /api/github/repos failed:", err);
    return NextResponse.json(
      { error: "Failed to load repos" },
      { status: 500 }
    );
  }
}
