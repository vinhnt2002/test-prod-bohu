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

export const getStores = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IStore>> => {
  noStore();

  const result = await fetchListData<IStore>("/stores", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IStore:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getStoreById(
  params: string
): Promise<ApiSingleResponse<IStore>> {
  noStore();

  const result = await fetchSingleData<IStore>(`/stores/seller/${params}`);
  if (!result.success) {
    console.error("Failed to fetch booking by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export const getProductsBySellerId = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IProduct>> => {
  noStore();

  const result = await fetchListData<IProduct>("/products", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IProduct:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function deactivateSeller(id: string): Promise<boolean> {
  try {
    await axiosAuth.delete(`/stores/${id}`);
    revalidatePath("/dashboard/manage-seller");
    return true;
  } catch (error) {
    console.error("Error deleting seller:", error);
    throw new Error("Failed to delete seller");
  }
}
