import { notFound } from "next/navigation";
import { getPromotionById } from "@/features/promotions/actions/promotion-action";
import { Shell } from "@/components/shared/custom-ui/shell";
import { PromotionDetailView } from "@/features/promotions/components/promotion-detail-view";

interface PromotionDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PromotionDetailPage({
  params,
}: PromotionDetailPageProps) {
  const { id } = params;

  const result = await getPromotionById(id);

  if (!result.data) {
    notFound();
  }

  return (
    <Shell>
      <PromotionDetailView promotion={result.data} />
    </Shell>
  );
}
