import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { dryRun, branches } = body;

    if (!Array.isArray(branches) || branches.length === 0) {
      return NextResponse.json(
        { error: "No branches provided" },
        { status: 400 }
      );
    }

    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    console.log("Deleting with token:", session.accessToken?.slice(0, 10));

    const deleted: any[] = [];
    const skipped: any[] = [];

    for (const b of branches) {
      const { owner, repo, branch } = b;

      if (!owner || !repo || !branch) {
        skipped.push({
          owner,
          repo,
          branch,
          reason: "invalid-payload",
        });
        continue;
      }

      if (dryRun) {
        skipped.push({
          owner,
          repo,
          branch,
          reason: "dry-run",
        });
        continue;
      }

      // 🚨 DO NOT encode the entire ref
      const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });
      console.log("Response scopes:", res.headers.get("x-oauth-scopes"));
      if (res.status === 204) {
        deleted.push({ owner, repo, branch });
        continue;
      }

      // Capture GitHub error details
      let errorBody: any = null;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }

      skipped.push({
        owner,
        repo,
        branch,
        reason: "delete-failed",
        status: res.status,
        githubMessage: errorBody?.message,
        documentation: errorBody?.documentation_url,
      });
    }

    return NextResponse.json({
      deleted,
      skipped,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Delete failed",
        message: err?.message,
      },
      { status: 500 }
    );
  }
}