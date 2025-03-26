// src/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Create and export the auth options
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate that credentials exist
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Make a request to your Go backend authentication endpoint
          const response = await axios.post(
            `${process.env.GO_BACKEND_URL}/auth/login`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          // Check if authentication was successful
          if (response.data.success && response.data.user) {
            return {
              id: response.data.user.id,
              username: response.data.user.username,
              email: response.data.user.email,
            };
          }

          // Return null if authentication failed
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      return session;
    },
  },
};

// Create handlers separately
const handler = NextAuth(authOptions);

export const { GET, POST } = handler;
export default handler;
