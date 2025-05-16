import { CategoryForm } from "@/features/categories/components/category-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo danh mục mới",
  description: "Thêm một danh mục sản phẩm mới vào hệ thống",
};

export default function NewCategoryPage() {
  return <CategoryForm />;
}
