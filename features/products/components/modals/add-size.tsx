import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface AddSizeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productType: string;
  side: "one_side" | "two_side";
  size: string;
  setSize: (size: string) => void;
  price: string;
  setPrice: (price: string) => void;
  onSave: () => void;
}

const AddSizeModal = ({
  isOpen,
  onOpenChange,
  productType,
  side,
  size,
  setSize,
  price,
  setPrice,
  onSave,
}: AddSizeModalProps) => {
  // Validate inputs
  const isValidSize = size.trim().length > 0;
  const isValidPrice = !isNaN(Number(price)) && Number(price) >= 0;
  const canSave = isValidSize && isValidPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Thêm kích cỡ mới
          </DialogTitle>
          <DialogDescription>
            Thêm kích cỡ mới cho sản phẩm {productType} -{" "}
            {side === "one_side" ? "in một mặt" : "in hai mặt"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Loại sản phẩm</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm mt-1.5">
                {productType}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Mặt in</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm mt-1.5">
                {side === "one_side" ? "Một mặt" : "Hai mặt"}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium" htmlFor="size">
              Kích cỡ mới
            </Label>
            <div className="mt-1.5">
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Nhập kích cỡ (ví dụ: S, M, L, XL, A4, A3...)"
                className="pl-10"
              />
            </div>
            {!isValidSize && size !== "" && (
              <p className="text-xs text-destructive mt-1.5">
                Kích cỡ không được để trống
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium" htmlFor="price">
              Giá (USD)
            </Label>
            <div className="mt-1.5">
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá"
                min="0"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {isValidPrice ? (
                <>
                  Giá hiển thị:{" "}
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(price))}
                  </span>
                </>
              ) : (
                "Vui lòng nhập giá hợp lệ"
              )}
            </p>
          </div>

          {(!isValidPrice || !isValidSize) && price !== "" && size !== "" && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!isValidSize && !isValidPrice
                  ? "Kích cỡ không được để trống và giá phải là một số dương"
                  : !isValidSize
                  ? "Kích cỡ không được để trống"
                  : "Giá phải là một số dương"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSave} disabled={!canSave}>
            Thêm kích cỡ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSizeModal;
