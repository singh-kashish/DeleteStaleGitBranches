import { GitHubMcpClient } from "./github.client";
import { HttpMcpTransport } from "./mcp.transport";

/**
 * Server-only factory for GitHub MCP client
 */
export function createGitHubMcpClient(token: string) {
  return new GitHubMcpClient({
    token,
    transport: new HttpMcpTransport(
      process.env.MCP_GITHUB_ENDPOINT!
    ),
  });
}
