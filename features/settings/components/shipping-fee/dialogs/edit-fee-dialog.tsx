import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItemType: "shipping" | "additional" | "";
  editMethod: string;
  tempValues: {
    lightItems: number;
    heavyItems: number;
  };
  onTempValuesChange: (values: {
    lightItems: number;
    heavyItems: number;
  }) => void;
  onSave: () => void;
}

const EditFeeDialog = ({
  open,
  onOpenChange,
  editItemType,
  editMethod,
  tempValues,
  onTempValuesChange,
  onSave,
}: EditFeeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {editItemType === "shipping" ? "Shipping" : "Additional Item"}{" "}
            Fees - {editMethod}
          </DialogTitle>
          <DialogDescription>
            Update the fees for {editMethod.toLowerCase()} shipping.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="light-items" className="text-right">
              Light Items
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="light-items"
                type="number"
                step="0.01"
                value={tempValues.lightItems}
                onChange={(e) =>
                  onTempValuesChange({
                    ...tempValues,
                    lightItems: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="heavy-items" className="text-right">
              Heavy Items
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="heavy-items"
                type="number"
                step="0.01"
                value={tempValues.heavyItems}
                onChange={(e) =>
                  onTempValuesChange({
                    ...tempValues,
                    heavyItems: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeDialog;
