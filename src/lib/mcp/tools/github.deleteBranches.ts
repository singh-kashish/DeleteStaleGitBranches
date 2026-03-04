import { Octokit } from "@octokit/rest";
import { DeleteBranchesInput, DeleteBranchesResult } from "../github.types";

export async function deleteBranches(
  token: string,
  input: DeleteBranchesInput
): Promise<DeleteBranchesResult> {
  const octokit = new Octokit({ auth: token });

  const result: DeleteBranchesResult = {
    dryRun: input.dryRun,
    results: [],
  };

  for (const { owner, repo, branch } of input.branches) {
    // ✅ DRY RUN MODE
    if (input.dryRun) {
      result.results.push({
        owner,
        repo,
        branch,
        status: "dry-run",
      });
      continue;
    }

    try {
      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });

      result.results.push({
        owner,
        repo,
        branch,
        status: "deleted",
      });
    } catch (err: any) {
      const message =
        typeof err?.message === "string" ? err.message : "Unknown error";

      result.results.push({
        owner,
        repo,
        branch,
        status: "failed",
        error: message,
      });
    }
  }

  return result;
}