import { Octokit } from "@octokit/rest";
import {
  DeleteBranchesInput,
  DeleteBranchesResult,
} from "../github.types";

export async function deleteBranches({
  token,
  branches,
  dryRun,
}: DeleteBranchesInput & { token: string }): Promise<DeleteBranchesResult> {
  const octokit = new Octokit({ auth: token });

  const results: DeleteBranchesResult["results"] = [];

  for (const { owner, repo, branch } of branches) {
    if (dryRun) {
      results.push({
        owner,
        repo,
        branch,
        status: "DRY_RUN",
      });
      continue;
    }

    try {
      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });

      results.push({
        owner,
        repo,
        branch,
        status: "DELETED",
      });
    } catch (err) {
      results.push({
        owner,
        repo,
        branch,
        status: "FAILED",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return { results };
}
