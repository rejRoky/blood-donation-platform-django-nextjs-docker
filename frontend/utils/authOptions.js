import { apiClient } from "@/lib/axios";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        mobile_number: { label: "Mobile Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Explicit payload: only the fields the API contract defines.
          const response = await apiClient.post("/users/login/", {
            mobile_number: credentials?.mobile_number || credentials?.phone_number,
            password: credentials?.password,
          });
          if (response.data.user && response.data.token) {
            return {
              ...response.data.user,
              accessToken: response.data.token.access,
              refreshToken: response.data.token.refresh,
              user_address: response.data.user_address,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
