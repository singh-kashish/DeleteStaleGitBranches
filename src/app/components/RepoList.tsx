// src/app/components/RepoList.tsx
"use client";

import { useEffect, useState } from "react";

export default function RepoList() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRepos = async () => {
    setLoading(true);
    const res = await fetch("/api/github/repos");
    const data = await res.json();
    console.log(res,data);
    setRepos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRepos();
  }, []);

  if (loading) return <p className="text-xl p-4">Loading repositories...</p>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-2">Your Repositories</h2>
      {repos.map((repo) => (
        <div key={repo.id} className="p-3 rounded-lg border hover:bg-muted/20">
          <p className="font-medium">{repo.name}</p>
        </div>
      ))}
    </div>
  );
}
