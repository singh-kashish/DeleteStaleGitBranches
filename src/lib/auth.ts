import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization:
        "https://github.com/login/oauth/authorize?scope=repo%20delete_repo%20read:user%20user:email",
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Runs on sign in
      if (account?.access_token) {
        console.log("Granted scopes from GitHub:", account.scope);
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
};