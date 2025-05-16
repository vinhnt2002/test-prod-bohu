import { Shell } from "@/components/shared/custom-ui/shell";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tạo khuyến mãi mới",
  description: "Tạo khuyến mãi mới cho cửa hàng",
};

export default function CreatePromotionPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/dashboard/promotions">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                Tạo khuyến mãi mới
              </h1>
              <p className="text-sm text-muted-foreground">
                Thêm khuyến mãi mới vào hệ thống
              </p>
            </div>
          </div>
        </div>
        <Separator />
        <PromotionForm mode="create" />
      </div>
    </Shell>
  );
}
