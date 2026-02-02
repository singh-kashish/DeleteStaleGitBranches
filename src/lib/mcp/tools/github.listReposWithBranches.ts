import { Octokit } from "@octokit/rest";
import { RepoWithBranches } from "../github.types";

export async function listReposWithBranches(
  token: string
): Promise<RepoWithBranches[]> {
  const octokit = new Octokit({ auth: token });

  const { data: repos } =
    await octokit.repos.listForAuthenticatedUser({
      per_page: 50, // Limit to 50 most recently updated repos for faster initial load
      sort: "updated",
    });

  // Process all repos in parallel instead of sequentially
  const result = await Promise.all(
    repos.map(async (repo) => {
      try {
        const { data: branches } = await octokit.repos.listBranches({
          owner: repo.owner.login,
          repo: repo.name,
          per_page: 100,
        });

        const branchData = await Promise.all(
          branches.map(async (branch) => {
            try {
              const commit = await octokit.repos.getCommit({
                owner: repo.owner.login,
                repo: repo.name,
                ref: branch.name,
              });

              const lastCommitDate =
                commit.data.commit.committer?.date ??
                commit.data.commit.author?.date ??
                new Date().toISOString();

              const staleDays = Math.floor(
                (Date.now() - new Date(lastCommitDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return {
                name: branch.name,
                lastCommitDate,
                staleDays,
                isDefault: branch.name === repo.default_branch,
              };
            } catch (err) {
              // If commit fetch fails, use current date as fallback
              console.warn(
                `Failed to fetch commit for ${repo.name}/${branch.name}:`,
                err
              );
              return {
                name: branch.name,
                lastCommitDate: new Date().toISOString(),
                staleDays: 0,
                isDefault: branch.name === repo.default_branch,
              };
            }
          })
        );

        return {
          repo: {
            id: repo.id,
            name: repo.name,
            owner: repo.owner.login,
            defaultBranch: repo.default_branch,
          },
          branches: branchData.sort((a, b) => b.staleDays - a.staleDays),
        };
      } catch (err) {
        // If repo processing fails, skip it but log the error
        console.warn(`Failed to process repo ${repo.name}:`, err);
        return null;
      }
    })
  );

  // Filter out any null results from failed repo processing
  return result.filter(
    (item): item is RepoWithBranches => item !== null
  );
}
