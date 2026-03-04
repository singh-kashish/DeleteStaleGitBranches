# 🚀 GitHub Unmerged Branch Cleaner

A secure web application that allows you to bulk-delete unmerged GitHub branches across repositories with a clean, production-grade UI.

Built with **Next.js 14, NextAuth, TypeScript, and GitHub REST API**.

---

## ✨ Why This Exists

Over time, repositories accumulate stale branches that:

- Are no longer needed
- Have already been merged
- Pollute the branch list
- Slow down repository navigation

This tool helps you:

✅ View repositories  
✅ List branches per repo  
✅ Protect default branches  
✅ Select multiple branches  
✅ Delete in bulk  
✅ Get optimistic UI updates  
✅ Confirm destructive actions

All securely — without exposing GitHub tokens.

---

## 🔐 Security First

- OAuth via GitHub
- JWT session strategy
- Access token stored server-side
- No client-side GitHub API calls
- No exposed personal access tokens
- Scoped permissions (`repo`, `delete_repo`, `read:user`, `user:email`)

All destructive actions happen via internal API routes.

---

## 🧱 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **NextAuth v4**
- **GitHub REST API**
- **Tailwind CSS**
- Server Actions via API routes
- Optimistic UI updates

---

## 🖥 Features

### 🔑 GitHub OAuth Login

Secure authentication using GitHub provider.

### 📦 Repository Listing

Fetches all accessible repositories for the user.

### 🌿 Branch Management

- Shows branches per repository
- Protects default branches from deletion
- Displays last commit date

### ✅ Smart Selection

- Select entire repo
- Select individual branches
- Auto-count selected items
- Sticky bulk action bar

### ⚡ Optimistic Deletion

- Branches disappear immediately
- Rollback on failure
- Confirmation modal
- Success feedback

---

## 📸 Demo Flow

1. Sign in with GitHub
2. View repositories
3. Select branches
4. Confirm deletion
5. See instant UI update

---

## 🏗 Project Structure

# 🚀 GitHub Unmerged Branch Cleaner

A secure web application that allows you to bulk-delete unmerged GitHub branches across repositories with a clean, production-grade UI.

Built with **Next.js 14, NextAuth, TypeScript, and GitHub REST API**.

---

## ✨ Why This Exists

Over time, repositories accumulate stale branches that:

- Are no longer needed
- Have already been merged
- Pollute the branch list
- Slow down repository navigation

This tool helps you:

✅ View repositories  
✅ List branches per repo  
✅ Protect default branches  
✅ Select multiple branches  
✅ Delete in bulk  
✅ Get optimistic UI updates  
✅ Confirm destructive actions

All securely — without exposing GitHub tokens.

---

## 🔐 Security First

- OAuth via GitHub
- JWT session strategy
- Access token stored server-side
- No client-side GitHub API calls
- No exposed personal access tokens
- Scoped permissions (`repo`, `delete_repo`, `read:user`, `user:email`)

All destructive actions happen via internal API routes.

---

## 🧱 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **NextAuth v4**
- **GitHub REST API**
- **Tailwind CSS**
- Server Actions via API routes
- Optimistic UI updates

---

## 🖥 Features

### 🔑 GitHub OAuth Login

Secure authentication using GitHub provider.

### 📦 Repository Listing

Fetches all accessible repositories for the user.

### 🌿 Branch Management

- Shows branches per repository
- Protects default branches from deletion
- Displays last commit date

### ✅ Smart Selection

- Select entire repo
- Select individual branches
- Auto-count selected items
- Sticky bulk action bar

### ⚡ Optimistic Deletion

- Branches disappear immediately
- Rollback on failure
- Confirmation modal
- Success feedback

---

## 📸 Demo Flow

1. Sign in with GitHub
2. View repositories
3. Select branches
4. Confirm deletion
5. See instant UI update

---

## 🏗 Project Structure

app/
api/
auth/[...nextauth]/route.ts
github/
repos/route.ts
delete/route.ts
components/
RepoList.tsx
lib/
auth.ts

---

## 🔄 API Endpoints

### GET `/api/github/repos`

Fetch repositories with branches.

### POST `/api/github/delete`

Delete selected branches.

Payload:

```json
{
  "dryRun": false,
  "branches": [
    {
      "owner": "username",
      "repo": "repository",
      "branch": "branch-name"
    }
  ]
}

🧠 Engineering Decisions
Why JWT Sessions?

To securely pass GitHub access tokens from OAuth callback to internal API routes.

Why Optimistic UI?

Improves UX by removing latency perception.

Why Protect Default Branch?

Prevents accidental destructive operations.

Why Server-Side GitHub Calls?

Prevents leaking tokens and avoids CORS issues.

🚀 Local Setup
git clone <repo-url>
cd project
npm install

Create .env.local:

GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

Run:
npm run dev

⚠️ Disclaimer

This tool permanently deletes branches via GitHub API.

Use carefully.

Default branches are protected, but review selections before confirming.

🧑‍💻 Author

Kashish Singh
Frontend / Full Stack Engineer
React • Next.js • TypeScript • System Design

If this project helped you, ⭐ the repository.
```
