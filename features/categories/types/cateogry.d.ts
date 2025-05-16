type ICategory = {
  _id: string;
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  type: string;
  genre: string[];
  imageUrl: string | null;
  active: boolean;
};

// Định nghĩa loại danh mục để tạo/cập nhật
type CategoryFormData = Omit<
  ICategory,
  "_id" | "id" | "createdAt" | "updatedAt" | "slug" | "children"
>;
