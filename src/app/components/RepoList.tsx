"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className=" space-y-3 w-[65%] bg-[#0C1117] rounded-lg flex flex-col justify-start items-start">
      <h2 className="text-xl font-semibold">Your Repositories</h2>
      {repos.map(repo => (
        <div key={repo.id} className="p-3 w-[98%] flex items-end border rounded hover:bg-[#0C1117}">
          <Image src="../../folder.svg" alt="folder" width={40} height={40} /><p className="mb-1 text-lg ">{repo.name}</p>
        </div>
      ))}
    </div>
  );
}
