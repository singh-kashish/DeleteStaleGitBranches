import { NextResponse } from "next/server";
import { listReposWithBranches } from "@/lib/mcp/tools/github.listReposWithBranches";
import { deleteBranches } from "@/lib/mcp/tools/github.deleteBranches";
import type { DeleteBranchesInput } from "@/lib/mcp/github.types";

type McpCallBody = {
  tool?: string;
  input?: any;
};

/**
 * In-app MCP endpoint matching `httpMcpTransport`:
 * POST { tool: string, input: any }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as McpCallBody;
    const tool = body.tool;
    const input = body.input ?? {};

    if (!tool) {
      return NextResponse.json(
        { error: "Missing MCP tool" },
        { status: 400 }
      );
    }

    // All current GitHub MCP tools expect `token` inside `input`
    const token = input.token as string | undefined;
    if (!token) {
      return NextResponse.json(
        { error: "Missing token in MCP input" },
        { status: 400 }
      );
    }

    switch (tool) {
      case "github.listReposWithBranches": {
        const data = await listReposWithBranches(token);
        return NextResponse.json(data);
      }

      case "github.deleteBranches": {
        // Accept both shapes:
        // - from GitHubMcpClient: { token, input: DeleteBranchesInput }
        // - direct callers:      { token, dryRun, branches }
        const deleteInput =
          (input.input as DeleteBranchesInput | undefined) ??
          (input as DeleteBranchesInput);

        if (!deleteInput?.branches || !Array.isArray(deleteInput.branches)) {
          return NextResponse.json(
            { error: "Invalid delete input" },
            { status: 400 }
          );
        }

        const data = await deleteBranches(token, deleteInput);
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json(
          { error: `Unknown MCP tool: ${tool}` },
          { status: 400 }
        );
    }
  } catch (err) {
    // Requested: log full error to console for debugging
    console.error("❌ MCP /api/mcp/github/call failed:", err);
    return NextResponse.json(
      { error: "MCP call failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

