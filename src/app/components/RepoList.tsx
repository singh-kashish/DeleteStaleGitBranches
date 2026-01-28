"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RepoWithBranches } from "@/lib/mcp/types";

/* ---------------- Component ---------------- */

export default function RepoList() {
  const [repos, setRepos] = useState<RepoWithBranches[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<
    Record<number, Set<string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch repos (WITH branches) ---------------- */

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch repos");
        }

        setRepos(data);

        // initialize selection map
        const initialSelection: Record<number, Set<string>> = {};
        data.forEach((r: RepoWithBranches) => {
          initialSelection[r.repo.id] = new Set();
        });
        setSelectedBranches(initialSelection);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

  /* ---------------- Selection logic ---------------- */

  const toggleRepo = (repoId: number, branchNames: string[]) => {
    setSelectedBranches((prev) => {
      const current = prev[repoId] ?? new Set<string>();
      const allSelected = current.size === branchNames.length;

      return {
        ...prev,
        [repoId]: allSelected
          ? new Set()
          : new Set(branchNames),
      };
    });
  };

  const toggleBranch = (repoId: number, branchName: string) => {
    setSelectedBranches((prev) => {
      const next = new Set(prev[repoId]);
      next.has(branchName)
        ? next.delete(branchName)
        : next.add(branchName);
      return { ...prev, [repoId]: next };
    });
  };

  /* ---------------- Render guards ---------------- */

  if (loading) {
    return <p className="p-4 text-muted">Loading repositories…</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full max-w-5xl bg-muted border border-border rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-background border-b border-border">
          <tr className="text-left text-sm text-text/70">
            <th className="p-3 w-10">Select</th>
            <th className="p-3 w-10"></th>
            <th className="p-3 font-medium">Repository / Branch</th>
            <th className="p-3 font-medium text-right">Last Commit</th>
          </tr>
        </thead>

        <tbody>
          {repos.map(({ repo, branches }) => {
            const selected = selectedBranches[repo.id] ?? new Set<string>();
            const branchNames = branches.map((b) => b.name);
            const repoSelected =
              branches.length > 0 &&
              selected.size === branches.length;

            return (
              <>
                {/* ---------------- Repo Row ---------------- */}
                <tr
                  key={repo.id}
                  onClick={() =>
                    toggleRepo(repo.id, branchNames)
                  }
                  className="bg-background border-b border-border cursor-pointer hover:bg-muted/60"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={repoSelected}
                      onChange={() =>
                        toggleRepo(repo.id, branchNames)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border border-border"
                    />
                  </td>

                  <td className="p-3">
                    <Image
                      src="/folder.svg"
                      alt="repo"
                      width={20}
                      height={20}
                    />
                  </td>

                  <td className="p-3 font-semibold">
                    {repo.name}
                  </td>

                  <td className="p-3" />
                </tr>

                {/* ---------------- Branch Rows ---------------- */}
                {branches.map((branch) => {
                  const isSelected = selected.has(branch.name);

                  return (
                    <tr
                      key={`${repo.id}-${branch.name}`}
                      onClick={() =>
                        toggleBranch(repo.id, branch.name)
                      }
                      className={[
                        "bg-muted/30 border-b border-border",
                        "cursor-pointer hover:bg-muted/60",
                        isSelected
                          ? "ring-2 ring-inset ring-primary"
                          : "",
                      ].join(" ")}
                    >
                      <td className="p-3 ">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={branch.isDefault}
                          onChange={() =>
                            toggleBranch(repo.id, branch.name)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border border-border"
                        />
                      </td>

                      <td className="p-3" />  

                      <td className="p-3 text-sm flex items-center gap-2 justify-start">
                        <Image
                          src="/Git-Branch.svg"
                          alt="branch"
                          width={16}
                          height={16}
                        />
                        {branch.name}
                        {branch.isDefault && (
                          <span className="text-xs text-muted">
                            (default)
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-sm text-right text-muted-foreground">
                        {new Date(
                          branch.lastCommitDate
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
