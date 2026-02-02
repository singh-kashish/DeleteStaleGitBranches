import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitHubMcpClient } from "@/lib/mcp/github.client";
import { httpMcpTransport } from "@/lib/mcp/mcp.transport";
import { DeleteBranchesInput } from "@/lib/mcp/github.types";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as DeleteBranchesInput;

    const client = new GitHubMcpClient(
      session.accessToken,
      httpMcpTransport
    );

    const result = await client.deleteBranches(body);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ /api/github/delete failed:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
