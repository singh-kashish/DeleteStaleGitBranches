import { Octokit } from "@octokit/rest";
import { DeleteBranchesInput, DeleteBranchesResult } from "../github.types";

export async function deleteBranches(
  token: string,
  input: DeleteBranchesInput
): Promise<DeleteBranchesResult> {
  const octokit = new Octokit({ auth: token });

  const result: DeleteBranchesResult = { deleted: [], skipped: [] };

  for (const { owner, repo, branch } of input.branches) {
    if (input.dryRun) {
      result.skipped.push({
        owner,
        repo,
        branch,
        reason: "unknown",
        error: "dry-run",
      });
      continue;
    }

    try {
      // Debug: confirm the ref exists for this token before deleting
      try {
        const ref = await octokit.git.getRef({
          owner,
          repo,
          ref: `heads/${branch}`,
        });
        console.log("🔎 getRef OK:", {
          owner,
          repo,
          branch,
          ref: ref.data?.ref,
          sha: ref.data?.object?.sha,
        });
      } catch (getRefErr: any) {
        console.warn("🔎 getRef FAILED:", {
          owner,
          repo,
          branch,
          status: getRefErr?.status,
          message: getRefErr?.message,
        });

        try {
          const refs = await octokit.git.listMatchingRefs({
            owner,
            repo,
            ref: "heads",
          });
          const names = (refs.data ?? [])
            .map((r: any) => r.ref)
            .filter(Boolean);
          console.warn("🔎 listMatchingRefs(heads) sample:", {
            owner,
            repo,
            total: names.length,
            containsTarget: names.includes(`refs/heads/${branch}`),
            sample: names.slice(0, 25),
          });
        } catch (listErr: any) {
          console.warn("🔎 listMatchingRefs FAILED:", {
            owner,
            repo,
            status: listErr?.status,
            message: listErr?.message,
          });
        }
      }

      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });
      result.deleted.push({ owner, repo, branch });
    } catch (err: any) {
      const status = err?.status as number | undefined;
      const reason =
        status === 422
          ? "protected"
          : status === 404
            ? "not-found"
            : status === 403
              ? "forbidden"
              : "unknown";

      const message =
        typeof err?.message === "string" ? err.message : "Unknown error";

      console.error(
        `❌ deleteBranches failed for ${owner}/${repo}:${branch} (status=${status ?? "n/a"})`,
        err
      );

      result.skipped.push({
        owner,
        repo,
        branch,
        reason,
        error: message,
      });
    }
  }

  return result;
}
