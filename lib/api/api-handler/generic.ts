"use server";

import axios, { AxiosResponse } from "axios";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { handleAPIError, translateError } from "./hanlder-api-error";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export interface ApiListResponse<T> {
  data: T[];
  pageCount?: number;
  totalItemsCount?: number;
  error?: string;
}
export interface ApiSingleResponse<T> {
  data: T | null;
  error?: string;
}

export async function apiRequest<T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<Result<T>> {
  try {
    const response = await request();
    return { success: true, data: response.data };
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   const errorMessage = await handleAPIError(error);
    //   return { success: false, error: errorMessage };
    // }
    console.log(error);
    return { success: false, error: error as string };
  }
}

export async function fetchListData<T>(
  url: string,
  searchParams?: Record<string, any>
): Promise<Result<ApiListResponse<T>>> {
  const result = await apiRequest<{
    payload: T[];
    metadata: {
      totalItems: number;
      limit: number;
      totalPages: number;
    };
  }>(() => axiosAuth.get(url, { params: searchParams }));

  if (result.success) {
    const { payload, metadata } = result.data;
    return {
      success: true,
      data: {
        data: payload || [],
        pageCount: metadata?.totalPages || 0,
        totalItemsCount: metadata?.totalItems || 0,
      },
    };
  }

  return result;
}
export async function fetchSingleData<T>(
  url: string
): Promise<Result<ApiSingleResponse<T>>> {
  const result = await apiRequest<{ payload: T }>(() => axiosAuth.get(url));

  if (result.success) {
    return {
      success: true,
      data: { data: result.data.payload },
    };
  }

  return result;
}
