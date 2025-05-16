import { Shell } from "@/components/shared/custom-ui/shell";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPromotionById } from "@/features/promotions/actions/promotion-action";
import { notFound } from "next/navigation";

interface EditPromotionPageProps {
  params: {
    id: string;
  };
}

export default async function EditPromotionPage({
  params,
}: EditPromotionPageProps) {
  // Fetch promotion data
  const result = await getPromotionById(params.id);

  if (!result.data) {
    notFound();
  }

  const promotion = result.data;

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href={`/dashboard/promotions/${params.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                Cập nhật khuyến mãi
              </h1>
              <p className="text-sm text-muted-foreground">
                Cập nhật thông tin khuyến mãi: {promotion.name}
              </p>
            </div>
          </div>
        </div>
        <Separator />
        <PromotionForm mode="edit" promotion={promotion} />
      </div>
    </Shell>
  );
}
