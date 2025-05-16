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
export const getProducts = async (
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

export async function getProductBySlug(
  params: string
): Promise<ApiSingleResponse<IProduct>> {
  noStore();

  const result = await fetchSingleData<IProduct>(`/products/${params}`);
  if (!result.success) {
    console.error("Failed to fetch booking by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function postProduct(product: Partial<IProduct>) {
  noStore();

  try {
    // Prepare product data with default values for required fields
    const productData = {
      ...product,
      id: product.id || `PROD-${Date.now()}`,
      product_id: product.product_id || `PROD-${Date.now()}`,
      price: product.price || product.defaultPrice || 0,
      display_high_price:
        product.display_high_price || product.defaultPrice || 0,
      process: product.process || {
        img: true,
        step: 1,
      },
      source: product.source || "admin",
      updateTime: Date.now(),
      is_tm: product.is_tm || 0,
      version: product.version || 1,
      view_users_cnt: product.view_users_cnt || 0,
      allPricingData: product.allPricingData || {},
      promotion: product.promotion || {
        name: "",
        end_time: 0,
      },
    };

    const result = await axiosAuth.post("/products", productData);

    if (!result.data) {
      console.error("Failed to post product", result);
      return { data: null, error: "Failed to create product" };
    }

    // Revalidate the products page to show the new product
    revalidatePath("/dashboard/products");

    return { data: result.data };
  } catch (error) {
    console.error("Error creating product:", error);
    return { data: null, error: String(error) };
  }
}

// Hàm lấy danh sách sản phẩm ngắn gọn để chọn trong dialog
export async function getProductsForSelection(
  page: number = 1,
  search: string = "",
  limit: number = 20
): Promise<ApiListResponse<IProduct>> {
  noStore();

  try {
    // Tìm nạp danh sách sản phẩm với phân trang và tìm kiếm
    const result = await fetchListData<IProduct>("/products", {
      page,
      per_page: limit,
      sort: "name",
      order: "asc",
      search,
    });

    if (!result.success) {
      console.error("Failed to fetch products for selection:", result.error);
      return { data: [], pageCount: 0, error: result.error };
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching products for selection:", error);
    return { data: [], pageCount: 0, error: String(error) };
  }
}

export async function updateProduct(id: string, product: Partial<IProduct>) {
  noStore();

  try {
    // Prepare update data
    const updateData = {
      ...product,
      updateTime: Date.now(),
    };

    // Make API call to update the product
    const result = await axiosAuth.put(`/products/${id}`, updateData);

    if (!result.data) {
      console.error("Failed to update product", result);
      return { data: null, error: "Failed to update product" };
    }

    // Revalidate the product pages to show the updated data
    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${product.slug}`);

    return { data: result.data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error: String(error) };
  }
}
