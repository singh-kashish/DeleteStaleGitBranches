export class GitHubMcpError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "GitHubMcpError";
  }
}

export class UnauthorizedError extends GitHubMcpError {
  constructor() {
    super("Unauthorized: Missing or invalid GitHub token", 401);
  }
}

export class RateLimitError extends GitHubMcpError {
  constructor() {
    super("GitHub rate limit exceeded", 429);
  }
}

export class UnknownGitHubError extends GitHubMcpError {
  constructor(message = "Unknown GitHub error") {
    super(message, 500);
  }
}
