import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Edit,
  ImageIcon,
  XCircle,
} from "lucide-react";

interface CategoryDetailProps {
  category: ICategory;
}

export const CategoryDetail = ({ category }: CategoryDetailProps) => {
  const createdAt = category.createdAt
    ? format(new Date(category.createdAt), "PPP", { locale: enGB })
    : "N/A";

  const updatedAt = category.updatedAt
    ? format(new Date(category.updatedAt), "PPP", { locale: enGB })
    : "N/A";

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            Chi tiết danh mục
          </h2>
        </div>

        <Button size="sm" asChild>
          <Link href={`#`}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Thông tin cơ bản */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Thông tin chi tiết về danh mục sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  ID
                </h3>
                <p className="mt-1 text-sm font-medium">{category.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Slug
                </h3>
                <p className="mt-1 text-sm font-medium">{category.slug}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tên danh mục
              </h3>
              <p className="mt-1 text-base font-semibold">{category.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Thể loại
              </h3>
              <p className="mt-1 text-sm">{category.type}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Mô tả
              </h3>
              <p className="mt-1 text-sm">
                {category.description || "Không có mô tả"}
              </p>
            </div>

            {category.genre && category.genre.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Thể loại con
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {category.genre.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </h3>
                <div className="mt-1">
                  {category.active ? (
                    <Badge
                      variant="outline"
                      className="flex gap-1 items-center text-green-600 bg-green-50 border-green-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Đang hoạt động</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="flex gap-1 items-center"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Không hoạt động</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Ngày tạo: {createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Cập nhật: {updatedAt}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hình ảnh và thông tin hiển thị */}
        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            {category.imageUrl ? (
              <div className="overflow-hidden rounded-md border">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="h-auto w-full object-cover aspect-video"
                />
              </div>
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-md border bg-muted">
                <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
