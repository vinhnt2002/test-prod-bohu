import React from "react";
import { ShippingConfigPayload } from "@/features/settings/types/shipping/shipping";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";

interface ItemVariantsTabProps {
  shippingData: ShippingConfigPayload;
  categories: ICategory[];
  onAddHeavyItem: () => void;
  onRemoveHeavyItem: (item: string) => void;
  onAddMethod: () => void;
  onRemoveMethod: (method: string) => void;
}

const ItemVariantsTab = ({
  shippingData,
  categories,
  onAddHeavyItem,
  onRemoveHeavyItem,
  onAddMethod,
  onRemoveMethod,
}: ItemVariantsTabProps) => {
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Heavy Item Variants</h3>
          <Button size="sm" onClick={onAddHeavyItem}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Variant
          </Button>
        </div>
        {shippingData.heavy_item_variants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {shippingData.heavy_item_variants.map((item) => {
              // Find matching category if exists
              const matchingCategory = categories.find(
                (cat) => cat.name === item
              );

              return (
                <div
                  key={item}
                  className="flex items-start justify-between gap-2 p-3 border rounded-md hover:bg-accent/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item}</div>
                    {matchingCategory && (
                      <div className="flex flex-col mt-1 space-y-1">
                        {matchingCategory.type && (
                          <Badge variant="outline" className="w-fit">
                            {matchingCategory.type}
                          </Badge>
                        )}
                        {matchingCategory.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {matchingCategory.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveHeavyItem(item)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No heavy item variants defined yet.
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Shipping Methods</h3>
          <Button size="sm" onClick={onAddMethod}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Method
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {shippingData.shipping_methods.length > 0 ? (
            shippingData.shipping_methods.map((method) => (
              <Badge key={method} className="flex items-center gap-1 py-1.5">
                {method}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onRemoveMethod(method)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No shipping methods defined yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemVariantsTab;
