import { Octokit } from "@octokit/rest";
import { RepoWithBranches } from "../github.types";

export async function listReposWithBranches({
  token,
}: {
  token: string;
}): Promise<RepoWithBranches[]> {
  const octokit = new Octokit({ auth: token });

  const { data: repos } =
    await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
    });

  const result: RepoWithBranches[] = [];

  for (const repo of repos) {
    const { data: branches } = await octokit.repos.listBranches({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 100,
    });

    const enrichedBranches = await Promise.all(
      branches.map(async (branch) => {
        const { data: commit } = await octokit.repos.getCommit({
          owner: repo.owner.login,
          repo: repo.name,
          ref: branch.name,
        });

        const lastCommitDate =
          commit.commit.committer?.date ??
          commit.commit.author?.date ??
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
      })
    );

    enrichedBranches.sort((a, b) => b.staleDays - a.staleDays);

    result.push({
      repo: {
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        defaultBranch: repo.default_branch,
      },
      branches: enrichedBranches,
    });
  }

  return result;
}
