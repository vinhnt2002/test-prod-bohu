import axios from "axios";

import refreshToken from "./refresh-token-server";
import { nextAuthAuth as auth, update } from "@/lib/next-auth/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create API instance without auth headers initially
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create authenticated API instance
export const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request interceptor to include auth token
axiosAuth.interceptors.request.use(
  async (config) => {
    const session = await auth();

    // Use Firebase token from session
    if (session?.firebaseToken) {
      config.headers["Authorization"] = `Bearer ${session.firebaseToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Client-side API with auth
export const createAuthAxios = (firebaseToken: string) => {
  const authInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${firebaseToken}`,
    },
    withCredentials: false,
  });

  return authInstance;
};

// axiosAuth.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const session = await auth();
//     const prevRequest = error?.config;
//     if (error?.response?.status === 401 && !prevRequest?.sent) {
//       prevRequest.sent = true;

//       const updatedSession = await refreshToken(session);

//       const sessionChange = await update({
//         user: {
//           accessToken: updatedSession,
//         },
//       });

//       prevRequest.headers[
//         "Authorization"
//       ] = `Bearer ${sessionChange?.user?.accessToken}`;
//       return axiosAuth(prevRequest);
//     }
//     return Promise.reject(error);
//   }
// );
