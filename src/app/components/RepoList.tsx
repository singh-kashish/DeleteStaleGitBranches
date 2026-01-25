"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ---------------- Types ---------------- */

interface Repo {
  id: number;
  name: string;
  owner: {
    login: string;
  };
}

interface Branch {
  name: string;
  lastCommitDate: string;
}

/* ---------------- Component ---------------- */

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [branches, setBranches] = useState<Record<number, Branch[]>>({});
  const [selectedBranches, setSelectedBranches] = useState<
    Record<number, Set<string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch repos ---------------- */

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch repos");
        setRepos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

  /* ---------------- Fetch branches per repo ---------------- */

  const loadBranches = async (repo: Repo) => {
    if (branches[repo.id]) return;

    const res = await fetch(
      `/api/github/branches?owner=${repo.owner.login}&repo=${repo.name}`
    );
    const data = await res.json();

    if (res.ok) {
      setBranches((prev) => ({ ...prev, [repo.id]: data }));
      setSelectedBranches((prev) => ({ ...prev, [repo.id]: new Set() }));
    }
  };

  /* ---------------- Selection logic ---------------- */

  const toggleRepo = (repoId: number) => {
    const repoBranches = branches[repoId];
    if (!repoBranches) return;

    setSelectedBranches((prev) => {
      const current = prev[repoId] ?? new Set<string>();
      const allSelected = current.size === repoBranches.length;

      return {
        ...prev,
        [repoId]: allSelected
          ? new Set()
          : new Set(repoBranches.map((b) => b.name)),
      };
    });
  };

  const toggleBranch = (repoId: number, branchName: string) => {
    setSelectedBranches((prev) => {
      const next = new Set(prev[repoId]);
      next.has(branchName) ? next.delete(branchName) : next.add(branchName);
      return { ...prev, [repoId]: next };
    });
  };

  /* ---------------- Render guards ---------------- */

  if (loading) return <p className="p-4 text-muted">Loading repositories…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

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
          {repos.map((repo) => {
            loadBranches(repo);

            const repoBranches = branches[repo.id] ?? [];
            const selected = selectedBranches[repo.id] ?? new Set();
            const repoSelected =
              repoBranches.length > 0 &&
              selected.size === repoBranches.length;

            return (
              <>
                {/* ---------------- Repo Row ---------------- */}
                <tr
                  key={repo.id}
                  onClick={() => toggleRepo(repo.id)}
                  className="bg-background border-b border-border cursor-pointer hover:bg-muted/60"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={repoSelected}
                      onChange={() => toggleRepo(repo.id)}
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

                  <td className="p-3 font-semibold">{repo.name}</td>
                  <td className="p-3" />
                </tr>

                {/* ---------------- Branch Rows ---------------- */}
                {repoBranches.map((branch) => {
                  const isSelected = selected.has(branch.name);

                  return (
                    <tr
                      key={`${repo.id}-${branch.name}`}
                      onClick={() => toggleBranch(repo.id, branch.name)}
                      className={[
                        "bg-muted/30 border-b border-border",
                        "cursor-pointer hover:bg-muted/60",
                        isSelected ? "ring-2 ring-inset ring-primary" : "",
                      ].join(" ")}
                    >
                      <td className="p-3 pl-8">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleBranch(repo.id, branch.name)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border border-border"
                        />
                      </td>

                      <td className="p-3" />

                      <td className="p-3 text-sm flex items-center justify-start"><Image src="/Git-Branch.svg"
                      alt="repo"
                      width={20}
                      height={20}/>{branch.name}</td>

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
