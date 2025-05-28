import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
