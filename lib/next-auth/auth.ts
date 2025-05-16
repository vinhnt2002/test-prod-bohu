import axios from "axios";
import NextAuth, { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apiRequest } from "../api/api-handler/generic";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";

interface UserJWT extends JWT {
  id: string;
  email: string;
  roleName: string;
  name: string;
  phone: string;
  gender: string;
  avatarUrl: string;
  roleId: number;
  accessToken: string;
  refreshToken: string;
  emailVerified: Date | null;
  firebaseToken?: string;
}

interface FirebaseUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email as string,
            credentials.password as string
          );

          const user = userCredential.user;
          const token = await user.getIdToken();

          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            token: token,
          };
        } catch (error: any) {
          console.error("Firebase auth error:", error.code, error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const firebaseUser = user as FirebaseUser;
        token.id = firebaseUser.id;
        token.firebaseToken = firebaseUser.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).firebaseToken = token.firebaseToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
};

export const {
  handlers,
  auth: nextAuthAuth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth(authOptions);
