import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitHubMcpClient } from "@/lib/mcp/github.client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = new GitHubMcpClient({
    token: session.accessToken,
  });

  const data = await client.listReposWithBranches();
  return NextResponse.json(data);
}
