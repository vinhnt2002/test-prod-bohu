import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Pencil, PlusCircle } from "lucide-react";
import Link from "next/link";

interface PricingSideCardProps {
  productType: string;
  side: "one_side" | "two_side";
  sideData: Record<string, number>;
  handleEditPrice: (
    productType: string,
    side: "one_side" | "two_side",
    size: string,
    price: number
  ) => void;
  handleAddSize: (productType: string, side: "one_side" | "two_side") => void;
  onAddSize: (open: boolean) => void;
}

const PricingSideCard = ({
  productType,
  side,
  sideData,
  handleEditPrice,
  handleAddSize,
  onAddSize,
}: PricingSideCardProps) => {
  const isOneSide = side === "one_side";
  const colorClass = isOneSide ? "primary" : "secondary";
  const sideLabel = isOneSide ? "Một mặt" : "Hai mặt";

  // Get the size keys and sort them for consistent display
  const sizeKeys = Object.keys(sideData).sort();

  return (
    <Card
      className={`border border-${colorClass}/10 shadow-sm overflow-hidden`}
    >
      <div
        className={`bg-gradient-to-r from-${colorClass}/10 to-transparent p-3 flex items-center justify-between border-b border-${colorClass}/10`}
      >
        <div className="flex items-center gap-2">
          <Badge
            variant={isOneSide ? "default" : "secondary"}
            className={`bg-${colorClass} text-${colorClass}-foreground`}
          >
            {sideLabel}
          </Badge>
          <span className={`text-sm font-medium text-primary`}>
            {sizeKeys.length} kích cỡ
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/products/settings/bulk-edit/${productType}/${
                    isOneSide ? "one" : "two"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 hover:bg-${colorClass}/10`}
                  >
                    <Pencil size={14} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Chỉnh sửa hàng loạt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {sizeKeys.length === 0 ? (
        <div className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu kích cỡ
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-2"
            onClick={() => handleAddSize(productType, side)}
          >
            <PlusCircle size={14} className="mr-1" />
            Thêm kích cỡ mới
          </Button>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader className="bg-muted/10 sticky top-0">
              <TableRow>
                <TableHead className="w-[40%] font-medium">
                  <div className="flex items-center gap-1">
                    Kích cỡ
                    <ArrowUpDown size={14} className="text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-1">
                    Giá (USD)
                    <ArrowUpDown size={14} className="text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="w-[15%] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeKeys.map((size, index) => (
                <TableRow
                  key={`${productType}-${side}-${size}-${sideData[size]}`}
                  className={`hover:bg-${colorClass}/5 group`}
                >
                  <TableCell className="font-medium">{size}</TableCell>
                  <TableCell className="font-mono">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(sideData[size])}
                  </TableCell>
                  <TableCell className="text-right p-0 pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleEditPrice(productType, side, size, sideData[size])
                      }
                    >
                      <Pencil size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default PricingSideCard;
