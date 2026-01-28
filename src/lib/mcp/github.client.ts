import { Octokit } from "@octokit/rest";
import { RepoWithBranches } from "./types";
import { UnauthorizedError } from "./github.errors";

export class GitHubMcpClient {
  private octokit: Octokit;

  constructor(params: { token: string }) {
    if (!params.token) {
      throw new UnauthorizedError();
    }

    this.octokit = new Octokit({
      auth: params.token,
    });
  }

  async listReposWithBranches(): Promise<RepoWithBranches[]> {
    const { data: repos } =
      await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
      });

    const result: RepoWithBranches[] = [];

    for (const repo of repos) {
      const { data: branches } =
        await this.octokit.repos.listBranches({
          owner: repo.owner.login,
          repo: repo.name,
          per_page: 100,
        });

      const branchData = await Promise.all(
        branches.map(async (branch) => {
          const commit = await this.octokit.repos.getCommit({
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
            repo: repo.name,
            lastCommitSha: commit.data.sha,
            lastCommitDate,
            isDefault: branch.name === repo.default_branch,
            staleDays,
          };
        })
      );

      branchData.sort((a, b) => b.staleDays - a.staleDays);

      result.push({
        repo: {
          id: repo.id,
          name: repo.name,
          owner: repo.owner.login,
          defaultBranch: repo.default_branch,
        },
        branches: branchData,
      });
    }

    return result;
  }
}
