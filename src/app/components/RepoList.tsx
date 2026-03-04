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

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccessCount, setDeleteSuccessCount] = useState<number | null>(null);

  /* ---------------- Fetch repos ---------------- */

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch repos");
        }

        setRepos(data);

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
        [repoId]: allSelected ? new Set() : new Set(branchNames),
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

  /* ---------------- Delete logic ---------------- */

  const selectedForDelete = repos.flatMap(({ repo, branches }) =>
  branches
    .filter(
      (b) =>
        !b.isDefault &&
        selectedBranches[repo.id]?.has(b.name)
    )
    .map((b) => ({
      owner: repo.owner,
      repo: repo.name,
      branch: b.name,
      repoId: repo.id,
    }))
);


  const handleDeleteConfirmed = async () => {
  setDeleting(true);

  const previous = repos;
  const count = selectedForDelete.length;

  // Optimistic UI
  setRepos((current) =>
    current.map((r) => ({
      ...r,
      branches: r.branches.filter(
        (b) => !selectedBranches[r.repo.id]?.has(b.name)
      ),
    }))
  );

  try {
    const res = await fetch("/api/github/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dryRun: false,
        branches: selectedForDelete.map(
          ({ owner, repo, branch }) => ({
            owner,
            repo,
            branch,
          })
        ),
      }),
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // Clear selection
    setSelectedBranches((prev) => {
      const next = { ...prev };
      selectedForDelete.forEach((b) => {
        next[b.repoId]?.delete(b.branch);
      });
      return next;
    });

    // 🔥 Show success state in modal
    setDeleteSuccessCount(count);

    // Auto close after 2 seconds
    setTimeout(() => {
      setShowConfirm(false);
      setDeleteSuccessCount(null);
    }, 2000);

  } catch (err) {
    // Rollback
    setRepos(previous);
    setShowConfirm(false);
    alert("Delete failed. Changes reverted.");
  } finally {
    setDeleting(false);
  }
};

  /* ---------------- Render guards ---------------- */

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading repositories…
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  /* ---------------- UI ---------------- */

  return (
  <div className="w-full mx-auto bg-muted border border-border rounded-xl overflow-hidden relative">

    {/* 🔥 Sticky Delete Bar */}
    <div className="sticky top-0 z-10 bg-muted border-b border-border p-3 flex justify-end">
      <button
        disabled={selectedForDelete.length === 0 || deleting}
        onClick={() => setShowConfirm(true)}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {deleting
          ? "Deleting…"
          : `Delete selected (${selectedForDelete.length})`}
      </button>
    </div>

    {/* 🔥 Table */}
    <table className="w-full border-collapse">
      <thead className="bg-muted/30 border-b border-border">
        <tr className="text-left text-sm text-text/70">
          <th className="p-3 w-10">Select</th>
          <th className="p-3 w-10"></th>
          <th className="p-3">Repository / Branch</th>
          <th className="p-3 text-right">Last Commit</th>
        </tr>
      </thead>

      {repos.map(({ repo, branches }) => {
        const selected = selectedBranches[repo.id] ?? new Set<string>();
        const branchNames = branches.map((b) => b.name);

        return (
          <tbody key={repo.id}>
            {/* Repo row */}
            <tr
              onClick={() => toggleRepo(repo.id, branchNames)}
              className="border-b cursor-pointer hover:bg-muted/60"
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={
                    branches.length > 0 &&
                    selected.size === branches.length
                  }
                  onChange={() =>
                    toggleRepo(repo.id, branchNames)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </td>

              <td className="p-3">
                <Image src="/folder.svg" alt="" width={20} height={20} />
              </td>

              <td className="p-3 font-semibold">
                {repo.name}
              </td>

              <td />
            </tr>

            {/* Branch rows */}
            {branches.map((branch) => {
              const isSelected = selected.has(branch.name);

              return (
                <tr
                  key={`${repo.id}-${branch.name}`}
                  onClick={() =>
                    toggleBranch(repo.id, branch.name)
                  }
                  className={`border-b cursor-pointer hover:bg-muted/60 ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={branch.isDefault}
                      onChange={() =>
                        toggleBranch(repo.id, branch.name)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  <td />

                  <td className="p-3 text-sm flex gap-2">
                    <Image
                      src="/branch.png"
                      alt=""
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
          </tbody>
        );
      })}
    </table>

    {/* Confirm Modal (unchanged) */}
    {showConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">

      {/* 🔥 SUCCESS STATE */}
      {deleteSuccessCount !== null ? (
        <>
          <h2 className="text-lg font-semibold text-green-600">
            ✅ Deleted successfully
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {deleteSuccessCount} branch(es) were permanently removed.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-red-600">
            Delete {selectedForDelete.length} branch(es)?
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            This action is permanent and cannot be undone.
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 border rounded"
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteConfirmed}
              className="px-3 py-1 bg-red-600 text-white rounded"
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
  </div>
);;
}
