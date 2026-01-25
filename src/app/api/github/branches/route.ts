import { NextResponse } from "next/server";
import type {
  DeleteBranchesRequest,
  DeleteBranchResult,
} from "@/lib/mcp/types";

/**
 * DRY RUN ONLY (for now)
 */
export async function POST(req: Request) {
  const body = (await req.json()) as DeleteBranchesRequest;

  if (!body.dryRun) {
    return NextResponse.json(
      { error: "Only dryRun=true is allowed right now" },
      { status: 400 }
    );
  }

  // Fake execution for now — real MCP tool comes later
  const results: DeleteBranchResult[] = body.items.map((item) => ({
    repo: item.repo,
    branch: item.branch,
    status: "would-delete",
  }));

  return NextResponse.json({
    dryRun: true,
    results,
  });
}
