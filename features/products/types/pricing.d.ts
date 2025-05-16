export interface PricingSizeData {
  [size: string]: number;
}

export interface PricingSideData {
  one_side: PricingSizeData;
  two_side: PricingSizeData;
}

export interface PricingConfigData {
  [productType: string]: PricingSideData;
}

export interface PricingConfigResponse {
  code: number;
  message: string;
  payload: {
    [productType: string]: PricingSideData;
  };
  metadata: Record<string, any>;
}
