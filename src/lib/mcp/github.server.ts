import { GitHubMcpClient } from "./github.client";
import { httpMcpTransport } from "./mcp.transport";

export function createGitHubMcpClient(token: string) {
  return new GitHubMcpClient(
    token,
    httpMcpTransport
  );
}