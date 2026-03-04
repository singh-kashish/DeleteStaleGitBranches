import { DeleteBranchesInput, DeleteBranchesResult } from "@/lib/mcp/github.types";

export async function deleteBranches(
  input: DeleteBranchesInput
): Promise<DeleteBranchesResult> {
  const res = await fetch("/api/github/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }

  return res.json();
}
