"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategories } from "@/features/categories/actions/category-action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  ImageIcon,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateProduct } from "../../actions/product-action";
import { toast } from "sonner";
interface ProductDetailUpdateFormProps {
  product: IProduct | null;
  initialTab?: string;
}

// Định nghĩa schema cho việc validate với Zod
const productSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  name: z.string().min(3, { message: "Tên sản phẩm phải có ít nhất 3 ký tự" }),
  slug: z.string().min(3, { message: "Slug phải có ít nhất 3 ký tự" }),
  images: z.array(z.string().url({ message: "URL hình ảnh không hợp lệ" })),
  pre_build_product_id: z.string().optional(),
  side: z.number().min(1, { message: "Số mặt phải lớn hơn 0" }),
  category: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  defaultPrice: z.number().min(0, { message: "Giá không được âm" }),
  price: z.number().min(0, { message: "Giá không được âm" }),
  display_high_price: z
    .number()
    .min(0, { message: "Giá hiển thị không được âm" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductDetailUpdateForm = ({
  product,
  initialTab = "basic",
}: ProductDetailUpdateFormProps) => {
  const router = useRouter();
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  // Default image for fallback
  const DEFAULT_IMAGE =
    "https://via.placeholder.com/300x200?text=Hình+ảnh+không+khả+dụng";

  // State to track broken images
  const [brokenImages, setBrokenImages] = useState<{
    [key: number]: boolean;
  }>({});

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      product_id: "",
      name: "",
      slug: "",
      images: [],
      pre_build_product_id: "",
      side: 1,
      category: "",
      defaultPrice: 0,
      price: 0,
      display_high_price: 0,
    },
  });

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const { data } = await getCategories({ page: "1", limit: "1000" });
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục sản phẩm");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Update form values when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id || "",
        product_id: product.product_id || "",
        name: product.name || "",
        slug: product.slug || "",
        images: product.images || [],
        pre_build_product_id: product.pre_build_product_id || "",
        side: product.side || 1,
        category: product.category || "",
        defaultPrice: product.defaultPrice || 0,
        price: product.price || 0,
        display_high_price: product.display_high_price || 0,
      });
    }
  }, [product, form]);

  // Handle form submission
  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare product data for update
      const productData: Partial<IProduct> = {
        ...data,
        updateTime: Date.now(),
      };

      // Call API to update product
      const result = await updateProduct(
        product?._id || "",
        productData as IProduct
      );

      if (result.data) {
        toast.success("Sản phẩm đã được cập nhật thành công.");

        // Redirect to product detail page
        router.push(`/dashboard/products/${data.slug}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Không thể cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add image from URL
  const handleAddImageFromUrl = () => {
    if (newImageUrl && newImageUrl.trim() !== "") {
      try {
        // Validate URL
        new URL(newImageUrl);

        const currentImages = form.getValues("images");
        if (!currentImages.includes(newImageUrl)) {
          form.setValue("images", [...currentImages, newImageUrl]);
          setNewImageUrl("");
          toast.success("Đã thêm hình ảnh từ URL");
        } else {
          toast.error("URL hình ảnh này đã tồn tại");
        }
      } catch (error) {
        toast.error("URL hình ảnh không hợp lệ");
      }
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File "${file.name}" không phải là hình ảnh`);
          continue;
        }

        formData.append("file", file);

        const response = await fetch("https://api.bohubo.com/upload-design", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.firebaseToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { url } = await response.json();
        const currentImages = form.getValues("images");
        form.setValue("images", [...currentImages, url]);
        toast.success(`Đã tải lên "${file.name}"`);
      }
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh:", error);
      toast.error("Không thể tải lên hình ảnh. Vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );

    // Remove from broken images list if exists
    if (brokenImages[index]) {
      const updatedBrokenImages = { ...brokenImages };
      delete updatedBrokenImages[index];
      setBrokenImages(updatedBrokenImages);
    }

    toast.success("Đã xóa hình ảnh khỏi danh sách");
  };

  // Auto generate slug from product name
  const handleNameChange = (name: string) => {
    const slugValue = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    form.setValue("slug", slugValue);
  };

  // Handle image load error
  const handleImageError = (index: number) => {
    setBrokenImages((prev) => ({ ...prev, [index]: true }));
  };

  if (!product) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-32 bg-muted rounded mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Cập Nhật Sản Phẩm
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-mono">
                {product.id.substring(0, 10)}...
              </Badge>
              <Badge
                variant="secondary"
                className="capitalize bg-blue-500 text-xs dark:bg-blue-600"
              >
                {product.category}
              </Badge>
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-normal">
            <DollarSign size={14} className="mr-1" /> {product.defaultPrice}
          </Badge>
        </div>
      </CardHeader>

      <Tabs
        defaultValue={initialTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-6 pt-2 border-b">
          <TabsList className="h-10 bg-transparent w-full flex justify-start">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-5 h-10"
            >
              <div className="flex items-center mr-2 pr-2">
                Thông tin cơ bản
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-5 h-10"
            >
              <div className="flex items-center mr-2 pr-2">Hình ảnh</div>
            </TabsTrigger>
          </TabsList>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <CardContent className="p-6">
              <TabsContent value="basic" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Tên sản phẩm <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleNameChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Slug <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Danh mục <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            {isLoadingCategories ? (
                              <div className="flex items-center justify-center h-10 border rounded-md bg-muted/20">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">
                                  Đang tải danh mục...
                                </span>
                              </div>
                            ) : categories.length > 0 ? (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category.slug}
                                      value={category.slug}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <Input
                                  {...field}
                                  placeholder="Nhập tên danh mục"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Không có danh mục nào được tìm thấy. Vui lòng
                                  nhập tên danh mục.
                                </p>
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pre_build_product_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Pre-build Product ID
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="font-mono text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="defaultPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Giá mặc định{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="side"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Side <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn số mặt" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 mặt</SelectItem>
                                  <SelectItem value="2">2 mặt</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">
                      Danh sách hình ảnh
                    </Label>
                    <div className="flex items-center gap-2">
                      {Object.keys(brokenImages).length > 0 && (
                        <Badge
                          variant="outline"
                          className="font-normal text-amber-500 border-amber-500 flex items-center gap-1"
                        >
                          <AlertTriangle size={12} />
                          {Object.keys(brokenImages).length} lỗi
                        </Badge>
                      )}
                      <Badge variant="outline" className="font-normal">
                        {form.watch("images").length} hình ảnh
                      </Badge>
                    </div>
                  </div>

                  <Card className="overflow-hidden">
                    <div className="p-3 border-b flex justify-between items-center bg-muted/30">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 flex items-center gap-1"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload size={14} /> Tải lên
                        </Button>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Nhập URL hình ảnh"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="h-8 w-56 text-xs"
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            onClick={handleAddImageFromUrl}
                            className="absolute right-0 top-0 rounded-l-none h-full"
                            size="sm"
                            disabled={isUploading || !newImageUrl.trim()}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                      {isUploading && (
                        <Badge variant="secondary" className="animate-pulse">
                          Đang tải lên...
                        </Badge>
                      )}
                    </div>

                    <input
                      id="fileUpload"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />

                    {form.watch("images").length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 py-6">
                        <ImageIcon
                          size={24}
                          className="text-muted-foreground mb-2"
                        />
                        <p className="text-muted-foreground text-sm">
                          Chưa có hình ảnh nào
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="mt-1 h-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Tải ảnh lên ngay
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ScrollArea className="h-[280px]">
                          <div className="flex flex-nowrap gap-3 p-4 overflow-x-auto">
                            {form.watch("images").map((image, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "group relative rounded-md overflow-hidden border h-20 w-20 bg-muted/20",
                                  brokenImages[index] && "border-amber-400"
                                )}
                              >
                                <Image
                                  src={
                                    brokenImages[index] ? DEFAULT_IMAGE : image
                                  }
                                  width={80}
                                  height={80}
                                  alt={`Hình ảnh ${index + 1}`}
                                  className="object-cover h-full w-full"
                                  onError={() => handleImageError(index)}
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 z-10"
                                  onClick={() => handleRemoveImage(index)}
                                  title="Xóa hình ảnh"
                                >
                                  <X size={14} />
                                </button>

                                {/* Error indicator */}
                                {brokenImages[index] && (
                                  <div className="absolute top-1 left-1">
                                    <AlertTriangle
                                      size={14}
                                      className="text-amber-500"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Add more button */}
                            <div
                              className="flex flex-col items-center justify-center h-20 w-20 border border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Plus
                                size={16}
                                className="text-muted-foreground"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Thêm
                              </p>
                            </div>
                          </div>
                        </ScrollArea>
                      </>
                    )}
                  </Card>

                  <div className="text-xs text-muted-foreground mt-1">
                    <p>
                      Kéo thả file hoặc nhập URL để thêm hình ảnh. Hỗ trợ: JPG,
                      PNG, GIF, WebP.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>

            <CardFooter className="flex justify-between border-t py-4 px-6 bg-muted/30">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/products/${product?.slug}`)
                  }
                >
                  <X className="mr-2 h-4 w-4" />
                  Hủy
                </Button>
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const tabs = ["basic", "images"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    Quay lại
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {activeTab !== "images" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const tabs = ["basic", "images"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    Tiếp theo
                    <ArrowRight size={14} />
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-24"
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
};

export default ProductDetailUpdateForm;
