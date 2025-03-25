// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you would typically verify against your database
        // For demo purposes, we're using a simple check
        if (
          credentials?.email === "user@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "John Smith",
            email: "user@example.com",
          };
        }
        // If authentication fails
        return null;
      },
    }),
    // You can add more providers here like Google, GitHub, etc.
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Add an error page or use login for errors
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug in development
  secret:
    process.env.NEXTAUTH_SECRET ||
    "your-fallback-secret-do-not-use-in-production",
};

export default NextAuth(authOptions);
