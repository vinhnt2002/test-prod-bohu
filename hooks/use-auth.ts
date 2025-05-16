"use client";

import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  AuthError,
} from "firebase/auth";
import { createAuthAxios } from "@/lib/api/api-interceptor/api";
import { useMemo } from "react";

export const useAuth = () => {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  // Create axios instance with Firebase token whenever session changes
  const authAxios = useMemo(() => {
    const firebaseToken = (session as any)?.firebaseToken;
    return firebaseToken ? createAuthAxios(firebaseToken) : null;
  }, [session]);

  const login = async (
    email: string,
    password: string,
    callbackUrl: string = "/dashboard"
  ) => {
    try {
      // First sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      // Then sign in with NextAuth
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (!result?.error) {
        // Update session with new token if needed
        await updateSession();
        // router.push(callbackUrl);
        toast.success("Đăng nhập thành công");
        return { success: true };
      } else {
        toast.error("Đăng nhập thất bại");
        return { success: false, error: result.error };
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const authError = error as AuthError;
      const errorMessage =
        authError.code === "auth/invalid-credential"
          ? "Email hoặc mật khẩu không đúng"
          : "Đã xảy ra lỗi khi đăng nhập";
      toast.error(errorMessage);
      console.log("Login error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async (callbackUrl: string = "/dashboard") => {
    try {
      // Sign in with Firebase using Google provider
      const result = await signInWithPopup(auth, googleProvider);

      // Get Google auth token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // Sign in with NextAuth
      const nextAuthResult = await nextAuthSignIn("google", {
        redirect: false,
        callbackUrl,
      });

      if (!nextAuthResult?.error) {
        await updateSession();
        router.push(callbackUrl);
        toast.success("Đăng nhập Google thành công");
        return { success: true };
      } else {
        toast.error("Đăng nhập Google thất bại");
        return { success: false, error: nextAuthResult.error };
      }
    } catch (error: unknown) {
      console.error("Google login error:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập với Google");
      return {
        success: false,
        error: "Đã xảy ra lỗi khi đăng nhập với Google",
      };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Đăng ký tài khoản thành công");
      return { success: true, user: userCredential.user };
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const authError = error as AuthError;
      let errorMessage = "Đã xảy ra lỗi khi đăng ký";

      if (authError.code === "auth/email-already-in-use") {
        errorMessage = "Email này đã được sử dụng";
      } else if (authError.code === "auth/weak-password") {
        errorMessage = "Mật khẩu quá yếu";
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });

      router.push("/");
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    }
  };

  return {
    user: session?.user || null,
    token: (session as any)?.firebaseToken || null,
    isAuthenticated: !!session?.user,
    loading: status === "loading",
    login,
    loginWithGoogle,
    register,
    logout,
    authAxios, // Export the authenticated axios instance
  };
};
