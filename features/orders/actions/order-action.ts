"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
export const getOrders = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IOrder>> => {
  noStore();

  const result = await fetchListData<IOrder>("/orders/list", searchParams);

  console.log(result);

  if (!result.success) {
    console.error("Failed to fetch list IOrder:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getOrderById(
  params: string
): Promise<ApiSingleResponse<IOrder>> {
  noStore();

  const result = await fetchSingleData<IOrder>(`/orders/${params}`);
  if (!result.success) {
    console.error("Failed to fetch booking by ID:", result.error);
    return { data: null };
  }
  return result.data;
}
