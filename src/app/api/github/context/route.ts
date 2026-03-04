import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { githubTools } from "@/lib/mcp/github.tools";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tool, args } = await req.json();

  const handler = githubTools[tool as keyof typeof githubTools];
  if (!handler) {
    return NextResponse.json(
      { error: `Unknown tool: ${tool}` },
      { status: 400 }
    );
  }

  const result = await handler(session.accessToken, args);
  return NextResponse.json(result);
}
