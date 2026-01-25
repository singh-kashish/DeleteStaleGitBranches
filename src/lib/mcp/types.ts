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
