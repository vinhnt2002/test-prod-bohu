import axios from "axios";
import {
  ShippingConfigData,
  ShippingConfigResponse,
} from "../../types/shipping/shipping";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getShippingFees(): Promise<ShippingConfigResponse> {
  try {
    const response = await axios.get<ShippingConfigResponse>(
      `${API_URL}/pricing-config?type=shipping`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping fees:", error);
    throw error;
  }
}

export async function updateShippingFees(
  data: ShippingConfigData
): Promise<ShippingConfigResponse> {
  try {
    const response = await axios.put<ShippingConfigResponse>(
      `${API_URL}/pricing-config?type=shipping`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating shipping fees:", error);
    throw error;
  }
}
