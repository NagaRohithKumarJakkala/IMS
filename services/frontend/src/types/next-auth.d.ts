// types/next-auth.d.ts - Extended Types
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }
}
