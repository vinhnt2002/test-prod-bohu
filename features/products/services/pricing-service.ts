import axios from "axios";
import {
  PricingConfigData,
  PricingConfigResponse,
  PricingSideData,
  PricingSizeData,
} from "../types/pricing";

// Re-export types from the types file for easier access
export type {
  PricingConfigData as PricingDataType,
  PricingConfigResponse as ApiResponse,
  PricingSideData as PricingType,
  PricingSizeData as SizePrice,
};

/**
 * Fetches pricing configuration data from the API
 * @returns Promise with pricing data
 */
export async function fetchPricingData(): Promise<PricingConfigResponse> {
  try {
    const response = await axios.get<PricingConfigResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/pricing-config?type=price`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    throw error;
  }
}

/**
 * Updates pricing configuration data
 * @param pricingData The complete pricing data including any modifications
 * @returns Promise with the updated pricing data
 */
export async function updatePricingData(
  pricingData: PricingConfigData
): Promise<PricingConfigResponse> {
  try {
    const response = await axios.put<PricingConfigResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/pricing-config?type=price`,
      pricingData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating pricing data:", error);
    throw error;
  }
}
