import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailLower = credentials.email.toLowerCase();

        // --- DEMO ACCOUNTS BYPASS ---
        const isDemoStudent = emailLower.startsWith("demo-student");
        if ((isDemoStudent || emailLower === "demo-staff@sparklearn.com") && credentials.password === "demo") {
          let user = await prisma.user.findUnique({
            where: { email: emailLower },
            include: { staffProfile: true, studentProfile: true },
          });

          if (!user) {
            let staffUser = await prisma.user.findFirst({ where: { role: "STAFF" }, include: { staffProfile: true } });
            if (!staffUser || !staffUser.staffProfile) {
              staffUser = await prisma.user.create({
                data: {
                  name: "Demo Staff",
                  email: "demo-staff@sparklearn.com",
                  passwordHash: "DEMO_PASS",
                  role: "STAFF",
                  staffProfile: { create: { affiliateCode: "DEMOSTAFF" + Math.floor(Math.random()*1000), institutionName: "Demo School" } }
                },
                include: { staffProfile: true }
              });
            }

            if (isDemoStudent) {
              const school = await prisma.school.findFirst();
              if (!school) throw new Error("No schools found. Please seed the database.");
              
              let standard: any = "S10";
              if (emailLower.includes("1-3")) standard = "S2";
              else if (emailLower.includes("4-5")) standard = "S4";
              else if (emailLower.includes("6-8")) standard = "S7";
              else if (emailLower.includes("9-10")) standard = "S9";
              else if (emailLower.includes("11-12")) standard = "S11";

              user = await prisma.user.create({
                data: {
                  name: `Demo Student (${standard})`,
                  email: emailLower,
                  passwordHash: "DEMO_PASS",
                  role: "STUDENT",
                  studentProfile: {
                    create: {
                      standard,
                      schoolId: school.id,
                      staffId: staffUser.staffProfile!.id,
                    }
                  }
                },
                include: { staffProfile: true, studentProfile: true },
              });
            } else {
              user = await prisma.user.create({
                data: {
                  name: "Demo Staff",
                  email: emailLower,
                  passwordHash: "DEMO_PASS",
                  role: "STAFF",
                  staffProfile: { create: { affiliateCode: "DEMOSTAFF" + Math.floor(Math.random()*1000), institutionName: "Demo School" } }
                },
                include: { staffProfile: true, studentProfile: true },
              });
            }
          }
          return { id: user.id, name: user.name, email: user.email, role: user.role, staffId: user.staffProfile?.id ?? null, studentId: user.studentProfile?.id ?? null, standard: user.studentProfile?.standard ?? null };
        }
        // ----------------------------

        const user = await prisma.user.findUnique({
          where: { email: emailLower },
          include: {
            staffProfile: true,
            studentProfile: true,
          },
        });
        if (!user) return null;

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          staffId: user.staffProfile?.id ?? null,
          studentId: user.studentProfile?.id ?? null,
          standard: user.studentProfile?.standard ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.staffId = (user as any).staffId;
        token.studentId = (user as any).studentId;
        token.standard = (user as any).standard;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).staffId = token.staffId;
        (session.user as any).studentId = token.studentId;
        (session.user as any).standard = token.standard;
      }
      return session;
    },
  },
};
