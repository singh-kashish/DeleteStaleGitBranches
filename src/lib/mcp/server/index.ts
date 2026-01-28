import { listReposWithBranches } from "./github.tools";
import { deleteBranches } from "./github.delete";

export const mcpTools = {
  "github.listReposWithBranches": listReposWithBranches,
  "github.deleteBranches": deleteBranches,
};
