import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  ShippingConfigPayload,
  ShippingFeesType,
} from "@/features/settings/types/shipping/shipping";

interface AdditionalFeesTabProps {
  shippingData: ShippingConfigPayload;
  onEditFee: (method: string) => void;
}

const AdditionalFeesTab = ({
  shippingData,
  onEditFee,
}: AdditionalFeesTabProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Method</TableHead>
          <TableHead className="w-1/4">Light Items</TableHead>
          <TableHead className="w-1/4">Heavy Items</TableHead>
          <TableHead className="text-right w-1/4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingData.shipping_methods.map((method) => {
          const methodKey = method.toUpperCase();
          const fees =
            shippingData.additional_item_fees[
              methodKey as keyof ShippingFeesType
            ];

          return (
            <TableRow key={method}>
              <TableCell className="font-medium">{method}</TableCell>
              <TableCell>${fees?.LIGHT_ITEMS.toFixed(2) || "0.00"}</TableCell>
              <TableCell>${fees?.HEAVY_ITEMS.toFixed(2) || "0.00"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditFee(method)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdditionalFeesTab;
