import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMethod: string;
  onNewMethodChange: (value: string) => void;
  newMethodPricing: {
    shipping: {
      lightItems: number;
      heavyItems: number;
    };
    additional: {
      lightItems: number;
      heavyItems: number;
    };
  };
  onNewMethodPricingChange: (pricing: any) => void;
  onAddMethod: () => void;
}

const AddMethodDialog = ({
  open,
  onOpenChange,
  newMethod,
  onNewMethodChange,
  newMethodPricing,
  onNewMethodPricingChange,
  onAddMethod,
}: AddMethodDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Shipping Method</DialogTitle>
          <DialogDescription>
            Add a new shipping method with pricing configuration.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-6 py-4 px-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method-name" className="text-right">
                Method Name
              </Label>
              <Input
                id="method-name"
                value={newMethod}
                onChange={(e) => onNewMethodChange(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Express"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 text-center">Shipping Fees</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shipping-light" className="text-right">
                    Light Items
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="shipping-light"
                      type="number"
                      step="0.01"
                      value={newMethodPricing.shipping.lightItems}
                      onChange={(e) =>
                        onNewMethodPricingChange({
                          ...newMethodPricing,
                          shipping: {
                            ...newMethodPricing.shipping,
                            lightItems: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shipping-heavy" className="text-right">
                    Heavy Items
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="shipping-heavy"
                      type="number"
                      step="0.01"
                      value={newMethodPricing.shipping.heavyItems}
                      onChange={(e) =>
                        onNewMethodPricingChange({
                          ...newMethodPricing,
                          shipping: {
                            ...newMethodPricing.shipping,
                            heavyItems: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 text-center">
                Additional Item Fees
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="additional-light" className="text-right">
                    Light Items
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="additional-light"
                      type="number"
                      step="0.01"
                      value={newMethodPricing.additional.lightItems}
                      onChange={(e) =>
                        onNewMethodPricingChange({
                          ...newMethodPricing,
                          additional: {
                            ...newMethodPricing.additional,
                            lightItems: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="additional-heavy" className="text-right">
                    Heavy Items
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="additional-heavy"
                      type="number"
                      step="0.01"
                      value={newMethodPricing.additional.heavyItems}
                      onChange={(e) =>
                        onNewMethodPricingChange({
                          ...newMethodPricing,
                          additional: {
                            ...newMethodPricing.additional,
                            heavyItems: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddMethod} disabled={!newMethod.trim()}>
            Add Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMethodDialog;
