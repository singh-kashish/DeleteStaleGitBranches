import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGitHubMcpClient } from "@/lib/mcp/github.server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const client = createGitHubMcpClient(session.accessToken);
    const data = await client.listReposWithBranches();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to load branches" },
      { status: 500 }
    );
  }
}
