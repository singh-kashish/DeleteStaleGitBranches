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
/* ---------------- Branch ---------------- */

export interface Branch {
  name: string;
  lastCommitDate: string;
  staleDays: number;
  isDefault: boolean;
}

/* ---------------- Repo + Branches ---------------- */

export interface RepoWithBranches {
  owner: string;
  repo: string;
  branches: string[];
}

export interface DeleteBranchTarget {
  owner: string;
  repo: string;
  branch: string;
}

export interface DeleteBranchesInput {
  dryRun: boolean;
  branches: DeleteBranchTarget[];
}

export interface DeleteBranchesResult {
  deleted: DeleteBranchTarget[];
  skipped: DeleteBranchTarget[];
}
