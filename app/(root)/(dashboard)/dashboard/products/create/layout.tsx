import { Suspense } from "react";
import LoadingSpinner from "@/components/shared/custom-ui/loading-spinner";

interface CreateProductLayoutProps {
  children: React.ReactNode;
}

const CreateProductLayout = async ({ children }: CreateProductLayoutProps) => {
  // Here you can add authorization logic if needed
  // await authGuard([UserRole.ADMIN, UserRole.MANAGER]);

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default CreateProductLayout;
