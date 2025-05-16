import { Suspense } from "react";
import { UserRole } from "@/lib/enums/user-role-enum";
// import { authGuard } from "@/hooks/use-auth-session-server";
import LoadingSpinner from "@/components/shared/custom-ui/loading-spinner";
// import ReviewerBookingPageSkeleton from "@/components/shared/dashboard/loading-skeleton/reviewer-booking-skeleton";

// import ProductSkeleton from "@/components/shared/dashboard/loading-skeleton/booking-detail-skeleton";
interface ProductDetailLayoutProps {
  children: React.ReactNode;
}

const ProductDetailLayout = async ({
  children,
}: ProductDetailLayoutProps) => {
  // Server-side authentication sẽ mở nếu phân role
  // await authGuard([UserRole.REVIEWER, UserRole.MANAGER]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

export default ProductDetailLayout;
