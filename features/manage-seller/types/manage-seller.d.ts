type IStore = {
  _id: string;
  name: string;
  seller_id: string;
  description: string;
  logo: string | null;
  banner: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
  };
  metrics: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
  };
};
