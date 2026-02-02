import { Octokit } from "@octokit/rest";
import {
  DeleteBranchesInput,
  DeleteBranchesResult,
} from "../github.types";

export async function deleteBranches(
  token: string,
  input: DeleteBranchesInput
): Promise<DeleteBranchesResult> {
  const octokit = new Octokit({ auth: token });

  const result: DeleteBranchesResult = {
    success: [],
    failed: [],
  };

  for (const branch of input.branches) {
    const { owner, repo, branch: branchName } = branch;

    try {
      if (input.dryRun) {
        result.success.push({ repo, branch: branchName });
        continue;
      }

      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      });

      result.success.push({ repo, branch: branchName });
    } catch (err: any) {
      result.failed.push({
        repo,
        branch: branchName,
        reason:
          err?.status === 422
            ? "protected"
            : err?.status === 404
            ? "not-found"
            : "unknown",
      });
    }
  }

  return result;
}
