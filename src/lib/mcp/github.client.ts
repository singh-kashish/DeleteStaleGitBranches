import {
  RepoWithBranches,
  DeleteBranchesInput,
  DeleteBranchesResult,
} from "./github.types";
import { McpTransport } from "./mcp.transport";

export class GitHubMcpClient {
  constructor(
    private token: string,
    private transport: McpTransport
  ) {}

  async listReposWithBranches(): Promise<RepoWithBranches[]> {
    return this.transport.call<RepoWithBranches[]>(
      "github.listReposWithBranches",
      {
        token: this.token,
      }
    );
  }

  async deleteBranches(
    input: DeleteBranchesInput
  ): Promise<DeleteBranchesResult> {
    return this.transport.call<DeleteBranchesResult>(
      "github.deleteBranches",
      {
        token: this.token,
        input,
      }
    );
  }
}
