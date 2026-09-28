import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: "STAFF" | "STUDENT";
    staffId?: string | null;
    studentId?: string | null;
    standard?: string | null;
  }
  interface Session {
    user: User & {
      role: "STAFF" | "STUDENT";
      staffId?: string | null;
      studentId?: string | null;
      standard?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "STAFF" | "STUDENT";
    staffId?: string | null;
    studentId?: string | null;
    standard?: string | null;
  }
}