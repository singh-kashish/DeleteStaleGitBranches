import {
  GitHubRepo,
  RepoWithBranches,
  DeleteBranchesInput,
  DeleteBranchesResult,
} from "./github.types";
import {
  UnauthorizedError,
  UnknownGitHubError,
} from "./github.errors";

/**
 * MCP transport abstraction
 * (keeps this testable & replaceable)
 */
interface McpTransport {
  call<T>(tool: string, args: unknown): Promise<T>;
}

/**
 * GitHub MCP Client
 */
export class GitHubMcpClient {
  private token: string;
  private transport: McpTransport;

  constructor(params: { token: string; transport: McpTransport }) {
    if (!params.token) {
      throw new UnauthorizedError();
    }
    this.token = params.token;
    this.transport = params.transport;
  }

  /**
   * Fetch repositories (no branches)
   */
  async listRepos(): Promise<GitHubRepo[]> {
    try {
      return await this.transport.call<GitHubRepo[]>(
        "github.listRepos",
        { token: this.token }
      );
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Fetch repos with branches & staleness
   */
  async listReposWithBranches(): Promise<RepoWithBranches[]> {
    try {
      return await this.transport.call<RepoWithBranches[]>(
        "github.listReposWithBranches",
        { token: this.token }
      );
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Delete branches (supports dry run)
   */
  async deleteBranches(
    input: DeleteBranchesInput
  ): Promise<DeleteBranchesResult> {
    try {
      return await this.transport.call<DeleteBranchesResult>(
        "github.deleteBranches",
        {
          token: this.token,
          ...input,
        }
      );
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new UnknownGitHubError();
  }
}
