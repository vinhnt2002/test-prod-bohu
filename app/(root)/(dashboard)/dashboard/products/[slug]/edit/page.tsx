import { getProductBySlug } from "@/features/products/actions/product-action";
import ProductDetailUpdateForm from "@/features/products/components/product-form/product-detail-update-form";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

interface ProductEditPageProps {
  params: { slug: string };
  searchParams: { tab?: string };
}

const ProductEditPage = async ({
  params,
  searchParams,
}: ProductEditPageProps) => {
  const { slug } = params;
  const { tab } = searchParams;

  // Fetch product data
  const { data: product } = await getProductBySlug(slug);

  // If product not found, redirect to 404
  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/products/${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại chi tiết
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Chỉnh sửa sản phẩm</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-bold">
            Chỉnh sửa: {product.name}
          </CardTitle>
          <CardDescription className="mt-1">
            Cập nhật thông tin chi tiết sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ProductDetailUpdateForm product={product} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductEditPage;
