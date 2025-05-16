import { getCategoryBySlug } from "@/features/categories/actions/category-action";
import { CategoryDetail } from "@/features/categories/components/category-detail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data: category } = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Danh mục không tồn tại",
    };
  }

  return {
    title: `${category.name} - Chi tiết danh mục`,
    description: category.description || "Chi tiết danh mục sản phẩm",
  };
}

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { data: category } = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return <CategoryDetail category={category} />;
}
