import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing owner or repo" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branchesRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!branchesRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }

  const branches = await branchesRes.json();

  const enriched = await Promise.all(
    branches.map(async (branch: any) => {
      const commitRes = await fetch(branch.commit.url, {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      const commit = await commitRes.json();

      return {
        name: branch.name,
        protected: branch.protected,
        lastCommitDate:
          commit.commit?.committer?.date ??
          commit.commit?.author?.date,
      };
    })
  );

  // Sort by MOST stale first
  enriched.sort(
    (a, b) =>
      new Date(a.lastCommitDate).getTime() -
      new Date(b.lastCommitDate).getTime()
  );

  return NextResponse.json(enriched);
}
