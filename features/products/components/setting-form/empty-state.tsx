import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { PlusCircle, Tag } from "lucide-react";

interface EmptyStateProps {
  handleAddNewType: () => void;
}

const EmptyState = ({ handleAddNewType }: EmptyStateProps) => {
  return (
    <CardContent className="py-10 px-6">
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="bg-muted/20 p-4 rounded-full mb-4">
          <Tag size={36} className="text-muted-foreground/70" />
        </div>
        <h3 className="text-muted-foreground font-medium mb-3">
          Chưa có dữ liệu giá sản phẩm
        </h3>
        <p className="text-sm text-muted-foreground/70 max-w-md mb-5">
          Thêm loại sản phẩm đầu tiên để bắt đầu thiết lập bảng giá. Mỗi loại
          sản phẩm có thể có nhiều kích cỡ và mức giá khác nhau.
        </p>
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={handleAddNewType}
        >
          <PlusCircle size={16} />
          Thêm loại sản phẩm
        </Button>
      </div>
    </CardContent>
  );
};

export default EmptyState;
