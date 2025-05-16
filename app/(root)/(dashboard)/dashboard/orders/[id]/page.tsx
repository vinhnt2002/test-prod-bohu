import React from "react";
import { getOrderById } from "@/features/orders/actions/order-action";
import { Shell } from "@/components/shared/custom-ui/shell";
import { OrderDetailsView } from "@/features/orders/components/order-details/order-details";
import { notFound } from "next/navigation";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { data: order } = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <Shell>
      <OrderDetailsView order={order} />
    </Shell>
  );
}
