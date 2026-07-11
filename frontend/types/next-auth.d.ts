import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    mobileNumber?: string;
    bloodGroup?: string | null;
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  }

  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError";
    user: {
      id: string;
      name?: string | null;
      mobileNumber?: string;
      bloodGroup?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    mobileNumber?: string;
    bloodGroup?: string | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshTokenError";
  }
}
