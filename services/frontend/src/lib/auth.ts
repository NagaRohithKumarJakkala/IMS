import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          // Send credentials to backend for validation
          const response = await axios.post(
            `${process.env.GO_BACKEND_URL}/login`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          );

          if (response.data.success && response.data.user) {
            return {
              id: response.data.user.id,
              username: response.data.user.username,
              level_of_access: response.data.user.level_of_access,
              accessToken: response.data.token, // ✅ Ensure JWT is stored
            };
          }

          throw new Error("Invalid credentials");
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/signout",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.level_of_access = user.level_of_access;
        token.accessToken = user.accessToken; // ✅ Store JWT in JWT callback
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.level_of_access = token.level_of_access;
      }
      session.accessToken = token.accessToken; // ✅ Store JWT in session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;
