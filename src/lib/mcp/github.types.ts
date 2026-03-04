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
  repo: {
    id: number;
    name: string;
    owner: string;
    defaultBranch: string;
  };
  branches: {
    name: string;
    lastCommitDate: string;
    staleDays: number;
    isDefault: boolean;
  }[];
}

export interface DeleteBranchTarget {
  owner: string;
  repo: string;
  branch: string;
}


export type DeleteBranchesInput = {
  dryRun: boolean;
  branches: {
    owner: string;
    repo: string;
    branch: string;
  }[];
};

export type DeleteBranchesResult = {
  dryRun: boolean;
  results: {
    owner: string;
    repo: string;
    branch: string;
    status: "dry-run" | "deleted" | "failed";
    error?: string;
  }[];
};
