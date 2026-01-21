"use client";

import { useEffect, useState } from "react";

interface Repo {
  id: number;
  name: string;
}

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch repos");
        }

        setRepos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

  if (loading) return <p className="p-4">Loading repositories...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Your Repositories</h2>
      {repos.map(repo => (
        <div key={repo.id} className="p-3 border rounded">
          {repo.name}
        </div>
      ))}
    </div>
  );
}
