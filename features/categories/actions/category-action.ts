"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
export const getCategories = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICategory>> => {
  noStore();

  const result = await fetchListData<ICategory>(
    "/categories?page=1&limt=10",
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICategory:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getCategoryBySlug(
  params: string
): Promise<ApiSingleResponse<ICategory>> {
  noStore();

  const result = await fetchSingleData<ICategory>(`/categories/${params}`);
  if (!result.success) {
    console.error("Failed to fetch category by slug/id:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function createCategory(category: Partial<ICategory>) {
  try {
    const result = await axiosAuth.post<ICategory>(`/categories`, category);

    if (result.status === 200 || result.status === 201) {
      revalidatePath("/dashboard/categories");
      return { success: true, data: result.data };
    }

    return { success: false, error: result.data };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create category",
    };
  }
}
