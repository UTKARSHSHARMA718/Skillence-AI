import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserProfiles =
  | "HR"
  | "DESIGNING"
  | "PRODUCT_MANAGER"
  | "PRESALES"
  | "DEVELOPER"
  | "DEMAND_GENERATION";

declare module "next-auth" {
  interface User {
    data: {
      token: string;
      refreshToken: string;
      expiresIn: number;
      user: {
        email: string;
        role: string;
        profile: UserProfiles;
        id: string;
        name: string;
      };
    };
    role: string;
    profile?: UserProfiles;
  }

  interface Session {
    user?: User;
    accessToken?: string;
    error?: string;
    refreshToken: string;
  }
}

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing access token...");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshed = await response.json();
    const data = refreshed.data;

    if (!response.ok) throw refreshed;

    return {
      ...token,
      accessToken: data.newAccessToken,
      accessTokenExpires: data.expiresIn * 1000,
      refreshToken: data.newRefreshToken ?? token.refreshToken,
    };
  } catch (error) {
    console.log({ error });

    return {
      ...token,
      error: "AccessTokenExpired",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            },
          );

          const user = await res.json();

          if (!res.ok || !user) return null;

          return user;
        } catch (error) {
          console.log({ error });
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        return {
          accessToken: user.data.token,
          refreshToken: user.data.refreshToken,
          role: user.data.user.role,
          email: user.data.user.email,
          name: user.data.user.name,
          profile: user.data.user.profile,
          id: user.data.user.id,
          accessTokenExpires: user.data.expiresIn * 1000,
        };
      }

      // Token still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.profile = token.profile as UserProfiles;
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }

      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },
  },
};
