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
          const response = await axios.post(
            `${process.env.GO_BACKEND_URL}/auth/login`,
            { username: credentials.username, password: credentials.password },
            { headers: { "Content-Type": "application/json" } },
          );

          if (response.data.success) {
            return {
              id: response.data.user_id.toString(),
              username: credentials.username,
              level_of_access: response.data.level_of_access,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.level_of_access = user.level_of_access;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.level_of_access = token.level_of_access;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;
