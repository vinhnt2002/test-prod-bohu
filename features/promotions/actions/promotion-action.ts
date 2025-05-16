"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { apiRequest } from "@/lib/api/api-handler/generic";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getPromotions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IPromotion>> => {
  noStore();

  const result = await fetchListData<IPromotion>("/promotions", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IPromotion:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getPromotionById(
  params: string
): Promise<ApiSingleResponse<IPromotion>> {
  noStore();

  const result = await fetchSingleData<IPromotion>(`/promotions/${params}`);
  if (!result.success) {
    console.error("Failed to fetch booking by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function createPromotion(
  data: Omit<
    IPromotion,
    | "_id"
    | "created_at"
    | "updated_at"
    | "created_by"
    | "updated_by"
    | "usage_count"
  >
) {
  try {
    const result = await apiRequest<{ payload: IPromotion }>(() =>
      axiosAuth.post("/promotions", data)
    );

    if (result.success) {
      revalidatePath("/dashboard/promotions");
      return { success: true, data: result.data.payload };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error("Failed to create promotion:", error);
    return { success: false, error: "Failed to create promotion" };
  }
}

export async function updatePromotion(id: string, data: Partial<IPromotion>) {
  try {
    const result = await apiRequest<{ payload: IPromotion }>(() =>
      axiosAuth.put(`/promotions/${id}`, data)
    );

    if (result.success) {
      revalidatePath("/dashboard/promotions");
      return { success: true, data: result.data.payload };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error("Failed to update promotion:", error);
    return { success: false, error: "Failed to update promotion" };
  }
}

export async function deletePromotion(id: string) {
  try {
    const result = await apiRequest<{ payload: IPromotion }>(() =>
      axiosAuth.delete(`/promotions/${id}`)
    );

    if (result.success) {
      revalidatePath("/dashboard/promotions");
      return { success: true, data: result.data.payload };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    return { success: false, error: "Failed to delete promotion" };
  }
}

export async function updatePromotionStatus(id: string, active: boolean) {
  try {
    // Chỉ cập nhật trạng thái active
    const result = await apiRequest<{ payload: IPromotion }>(() =>
      axiosAuth.patch(`/promotions/${id}/status`, { active })
    );

    if (result.success) {
      revalidatePath("/dashboard/promotions");
      return { success: true, data: result.data.payload };
    }

    // Nếu API không hỗ trợ patch endpoint riêng, dùng phương thức PUT thông thường
    const updateResult = await updatePromotion(id, { active });
    return updateResult;
  } catch (error) {
    console.error("Failed to update promotion status:", error);
    return { success: false, error: "Failed to update promotion status" };
  }
}
