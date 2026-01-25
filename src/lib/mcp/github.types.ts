// Domain-level types (NOT GitHub API types)

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  updatedAt: string;
}

export interface GitHubBranch {
  name: string;
  repo: string;
  lastCommitAt: string;
  daysStale: number;
  protected: boolean;
}

export interface RepoWithBranches {
  repo: GitHubRepo;
  branches: GitHubBranch[];
}

/**
 * Delete request payload
 */
export interface DeleteBranchesInput {
  branches: {
    repo: string;
    branch: string;
  }[];
  dryRun: boolean;
}

/**
 * Delete response payload
 */
export interface DeleteBranchesResult {
  success: {
    repo: string;
    branch: string;
  }[];
  failed: {
    repo: string;
    branch: string;
    reason: string;
  }[];
}
export type DeleteBranchesRequest = {
  dryRun: boolean;
  items: {
    owner: string;
    repo: string;
    branch: string;
  }[];
};

export type DeleteBranchResult = {
  repo: string;
  branch: string;
  status: "would-delete" | "deleted" | "skipped";
  reason?: "protected" | "default-branch" | "not-found";
};
