import { listReposWithBranches } from "./tools/github.listReposWithBranches";
import { deleteBranches } from "./tools/github.deleteBranches";

export const githubTools = {
  "github.listReposWithBranches": listReposWithBranches,
  "github.deleteBranches": deleteBranches,
};
