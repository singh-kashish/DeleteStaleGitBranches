import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { tool, input, token } = await req.json();

  switch (tool) {
    case "github.deleteBranches":
      return fetch(
        `${process.env.NEXTAUTH_URL}/api/mcp/github/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, input }),
        }
      );

    default:
      return NextResponse.json(
        { error: `Unknown MCP tool: ${tool}` },
        { status: 400 }
      );
  }
}
