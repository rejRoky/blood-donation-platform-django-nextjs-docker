import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { serverApi, ApiError } from "@/lib/api";
import type { LoginResponse } from "@/lib/types";

/** Refresh 60s before actual expiry to absorb clock skew. */
const EXPIRY_MARGIN_MS = 60_000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const data = await serverApi<{ access: string; refresh?: string }>(
      "/users/token/refresh/",
      { method: "POST", body: { refresh: token.refreshToken } },
    );
    return {
      ...token,
      accessToken: data.access,
      // Backend rotates refresh tokens; fall back to the old one if absent.
      refreshToken: data.refresh ?? token.refreshToken,
      accessTokenExpires: Date.now() + 55 * 60_000,
      error: undefined,
    };
  } catch {
    // Refresh token expired or blacklisted — force re-login on the client.
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Mobile number",
      credentials: {
        mobile_number: { label: "Mobile number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.mobile_number || !credentials.password) return null;
        try {
          const data = await serverApi<LoginResponse>("/users/login/", {
            method: "POST",
            body: {
              mobile_number: credentials.mobile_number,
              password: credentials.password,
            },
          });
          return {
            id: data.user.id,
            name: [data.user.first_name, data.user.last_name].filter(Boolean).join(" "),
            mobileNumber: data.user.mobile_number,
            bloodGroup: data.user.blood_group,
            accessToken: data.token.access,
            refreshToken: data.token.refresh,
            expiresIn: data.token.expires_in,
          };
        } catch (error) {
          // Surface the backend's message ("Invalid mobile number or password.")
          if (error instanceof ApiError) throw new Error(error.message);
          throw new Error("Unable to sign in right now. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // matches the refresh token lifetime
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          sub: user.id,
          name: user.name,
          mobileNumber: user.mobileNumber,
          bloodGroup: user.bloodGroup,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + (user.expiresIn ?? 3600) * 1000 - EXPIRY_MARGIN_MS,
        };
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.mobileNumber = token.mobileNumber;
        session.user.bloodGroup = token.bloodGroup;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
