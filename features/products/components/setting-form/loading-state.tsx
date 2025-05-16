import { Card } from "@/components/ui/card";

const LoadingState = () => {
  return (
    <Card className="w-full h-[600px] flex items-center justify-center border shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
          <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin animation-delay-700"></div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Đang tải dữ liệu giá sản phẩm...
        </p>
      </div>
    </Card>
  );
};

export default LoadingState;
