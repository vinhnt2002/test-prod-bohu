import { Suspense } from "react";
import LoadingSpinner from "@/components/shared/custom-ui/loading-spinner";

interface ProductEditLayoutProps {
  children: React.ReactNode;
}

const ProductEditLayout = async ({ children }: ProductEditLayoutProps) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default ProductEditLayout;
