type IProduct = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  images: string[];
  category: string;
  defaultPrice: number;
  highPrice?: number;
  product_id: string;
  side: number;
  price: number;
  display_high_price: number;
  process: {
    img: boolean;
    step: number;
  };
  source: string;
  shop_id: string;
  warehouse_id: string;
  updateTime: number;
  is_tm: number;
  pre_build_product_id: string;
  version: number;
  view_users_cnt: number;
  allPricingData: {
    [key: string]: {
      one_side: {
        [key: string]: number;
      };
      two_side: {
        [key: string]: number;
      };
    };
  };
  promotion: {
    name: string;
    end_time: number;
  };
};
