export interface ShippingItemFees {
  LIGHT_ITEMS: number;
  HEAVY_ITEMS: number;
}

export interface ShippingFeesType {
  STANDARD: ShippingItemFees;
  PRIORITY: ShippingItemFees;
}

export interface ShippingConfigResponse {
  code: number;
  message: string;
  payload: ShippingConfigPayload;
  metadata: Record<string, any>;
}

export interface ShippingConfigPayload {
  _id: string;
  type: string;
  additional_item_fees: ShippingFeesType;
  created_at: number;
  heavy_item_variants: string[];
  shipping_fees: ShippingFeesType;
  shipping_methods: string[];
  updated_at: number;
}

export interface ShippingConfigData {
  type: string;
  additional_item_fees: ShippingFeesType;
  heavy_item_variants: string[];
  shipping_fees: ShippingFeesType;
  shipping_methods: string[];
}
