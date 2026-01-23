"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Repo {
  id: number;
  name: string;
}

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const toggleRepo = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) return <p className="p-4 text-muted">Loading repositories…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-4xl bg-muted border border-border rounded-xl overflow-hidden transition-colors">
      <table className="w-full border-collapse">
        <thead className="bg-background border-b border-border">
          <tr className="text-left text-sm text-text/70">
            <th className="p-3 w-10">Select</th>
            <th className="p-3 w-10"></th>
            <th className="p-3 font-medium">Repository</th>
          </tr>
        </thead>


        <tbody>
          {repos.map((repo) => {
            const isSelected = selected.has(repo.id);

            return (
              <tr
                key={repo.id}
                onClick={() => toggleRepo(repo.id)}
                className={[
                  "cursor-pointer transition-colors",
                  "bg-background border-b border-border",
                  "hover:bg-muted/60",
                  isSelected ? "ring-2 ring-inset ring-primary" : "",
                ].join(" ")}
              >
                {/* Checkbox */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRepo(repo.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="
                      h-4 w-4 rounded
                      border border-border
                      bg-background
                      text-primary
                      focus:ring-primary
                    "
                  />
                </td>

                {/* Folder icon */}
                <td className="p-3">
                  <Image
                    src="/folder.svg"
                    alt="folder"
                    width={40}
                    height={40}
                  />
                </td>

                {/* Repo name */}
                <td className="p-3 text-text font-medium">
                  {repo.name}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
