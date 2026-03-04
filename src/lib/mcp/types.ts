// SERVER ONLY — do NOT import into client components

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
  reason?: "default-branch" | "protected" | "not-found";
};
// src/lib/mcp/types.ts

export interface MCPRepo {
  id: number;
  name: string;
  owner: string;
  defaultBranch: string;
}

export interface MCPBranch {
  name: string;
  repo: string;
  lastCommitSha: string;
  lastCommitDate: string; // ISO
  isDefault: boolean;
  staleDays: number;
}

export interface RepoWithBranches {
  repo: MCPRepo;
  branches: MCPBranch[];
}
