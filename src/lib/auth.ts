import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Seamless Demo / Email Authentication: allow any email with password length >= 4
        if (typeof credentials.password === "string" && credentials.password.length >= 4) {
          const emailStr = credentials.email as string;
          const nameStr = (credentials.name as string) || emailStr.split("@")[0] || "Cultural Explorer";
          const formattedName = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
          return {
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
            name: formattedName,
            email: emailStr,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || "demo-user-id";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "wanderlore-secret-key-2026-super-secure-jwt",
});
