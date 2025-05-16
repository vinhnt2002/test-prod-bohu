"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// import { deleteSeller } from "../../actions/manage-seller-action";
import { deactivateSeller } from "../../actions/manage-seller-action";

interface DeleteSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: IStore;
}

export function DeactivateSellerDialog({
  open,
  onOpenChange,
  seller,
}: DeleteSellerDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleDeactivate() {
    try {
      setIsPending(true);
      // await deactivateSeller(seller._id);

      toast.success("Cửa hàng đã được ngưng hoạt động thành công");
      router.refresh();
    } catch (error) {
      console.error("Error deactivating seller:", error);
      toast.error("Đã xảy ra lỗi khi ngưng hoạt động cửa hàng");
    } finally {
      setIsPending(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn ngưng hoạt động cửa hàng này?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn đang thực hiện ngưng hoạt động cửa hàng:{" "}
            <span className="font-medium">{seller.name}</span>. Hành động này sẽ
            tạm dừng tất cả hoạt động của cửa hàng trên hệ thống, nhưng dữ liệu
            sẽ được giữ lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeactivate();
            }}
            disabled={isPending}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isPending ? "Đang xử lý..." : "Ngưng hoạt động"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
