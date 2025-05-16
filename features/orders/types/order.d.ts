type IOrder = {
  _id: string;
  cart_id: string;
  shipping_method: string;
  shipping_fee: number;
  handling_fee: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  created_at: number;
  updated_at: number;
  device_id: string;
  paypal_order_id: string;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    quantity: number;
    pre_build_product_id: string;
    product_id: string;
    name: string;
    image: string;
    side: number;
    slug: string;
    price: number;
  }[];
};
