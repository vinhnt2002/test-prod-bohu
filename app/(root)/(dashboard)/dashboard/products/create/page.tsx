import React from "react";
import { Shell } from "@/components/shared/custom-ui/shell";
import ProductCreateForm from "@/features/products/components/product-form/product-create-form";

export const metadata = {
  title: "Tạo Sản Phẩm Mới | Admin",
  description: "Tạo sản phẩm mới cho cửa hàng",
};

const CreateProductPage = () => {
  return (
    <div className="min-w-full">
      <Shell>
        <div className="container py-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Tạo Sản Phẩm Mới
            </h1>
            <p className="text-muted-foreground">
              Điền thông tin để tạo sản phẩm mới cho cửa hàng
            </p>
          </div>
          <ProductCreateForm />
        </div>
      </Shell>
    </div>
  );
};

export default CreateProductPage;
