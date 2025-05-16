"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createCategory } from "../actions/category-action";

import { ImageUploader } from "@/components/shared/custom-ui/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Schema cho form tạo/chỉnh sửa danh mục
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên danh mục phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  type: z.string().min(1, {
    message: "Thể loại không được để trống",
  }),
  genre: z.array(z.string()).optional(),
  imageUrl: z.string().nullable().optional(),
  images: z.array(z.string().url()).default([]),
  active: z.boolean().default(true),
  parentId: z.string().nullable().optional(),
  order: z.number().int().nonnegative().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: Partial<ICategory>;
  isEditing?: boolean;
}

export const CategoryForm = ({
  initialData,
  isEditing = false,
}: CategoryFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Chuyển đổi imageUrl thành mảng images
  const initialImages = initialData?.imageUrl ? [initialData.imageUrl] : [];

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      genre: [],
      imageUrl: null,
      images: [],
      active: true,
      parentId: null,
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        // Lấy URL hình ảnh đầu tiên từ mảng images (nếu có)
        const imageUrl = values.images.length > 0 ? values.images[0] : null;

        // Chuẩn bị dữ liệu để lưu
        const categoryData = {
          ...values,
          imageUrl,
        };

        const result = await createCategory(categoryData);
        if (result.success) {
          toast.success("Đã tạo danh mục mới thành công");
          router.push("/dashboard/categories");
        } else {
          toast.error(result.error || "Không thể tạo danh mục mới");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi lưu danh mục");
        console.error(error);
      }
    });
  };

  // Xử lý khi có thay đổi trong mảng hình ảnh
  const handleImagesChange = (newImages: string[]) => {
    form.setValue("images", newImages);
  };

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing
            ? "Cập nhật thông tin danh mục sản phẩm"
            : "Thêm một danh mục sản phẩm mới vào hệ thống"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            </TabsList>

            {/* Tab thông tin chung */}
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên danh mục" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể loại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập thể loại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả cho danh mục"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Tab hình ảnh */}
            <TabsContent value="images" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        images={field.value}
                        onImagesChange={handleImagesChange}
                        maxImages={5}
                      />
                    </FormControl>
                    <FormDescription>
                      Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính cho danh
                      mục
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/categories")}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
