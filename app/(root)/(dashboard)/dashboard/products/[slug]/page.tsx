import { getProductBySlug } from "@/features/products/actions/product-action";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  DollarSign,
  Edit,
  Eye,
  Layers,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { enGB } from "date-fns/locale";

const ProductDetailPage = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const { data: product } = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-6">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách sản phẩm
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = product.updateTime
    ? format(new Date(product.updateTime), "dd/MM/yyyy HH:mm", {
        locale: enGB,
      })
    : "Chưa cập nhật";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Trở về
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Chi tiết sản phẩm</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button asChild>
            <Link href={`/dashboard/products/${slug}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold line-clamp-2">
                {product.name}
              </CardTitle>
              <Badge variant={product.side === 1 ? "secondary" : "default"}>
                {product.side === 1 ? "1 mặt" : "2 mặt"}
              </Badge>
            </div>
            <CardDescription className="flex items-center mt-1">
              <span className="text-muted-foreground">Danh mục:</span>
              <Badge variant="outline" className="ml-2">
                {product.category}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  ID Sản phẩm
                </p>
                <p className="font-mono text-sm">{product.product_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Slug
                </p>
                <p className="font-mono text-sm">{product.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Pre-build ID
                </p>
                <p className="font-mono text-sm">
                  {product.pre_build_product_id || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Cập nhật lần cuối
                </p>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {formattedDate}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Thông tin giá
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <div className="flex items-center p-3 rounded-md bg-muted/40">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Giá mặc định
                    </p>
                    <p className="font-medium">${product.defaultPrice}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-md bg-muted/40">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Giá cao</p>
                    <p className="font-medium">${product.highPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-4">
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/products/${slug}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin sản phẩm
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Thumbnail và hình ảnh */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hình ảnh sản phẩm</CardTitle>
            <CardDescription>
              {product.images?.length || 0} hình ảnh
            </CardDescription>
          </CardHeader>
          <CardContent>
            {product.images?.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square relative rounded-md overflow-hidden border">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <ScrollArea className="h-32 w-full rounded-md">
                  <div className="flex gap-2 pb-4">
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 rounded-md overflow-hidden border shrink-0"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground text-sm">
                  Chưa có hình ảnh
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-4">
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/products/${slug}/edit?tab=images`}>
                <Edit className="mr-2 h-4 w-4" />
                Quản lý hình ảnh
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
