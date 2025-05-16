"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createPromotion, updatePromotion } from "../actions/promotion-action";
import { Button } from "@/components/ui/button";
import { ProductSelector } from "./product-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Date validation range - e.g., can only create promotions for future dates
const today = new Date();
today.setHours(0, 0, 0, 0);

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1, "Tên khuyến mãi không được để trống"),
  code: z.string().min(1, "Mã khuyến mãi không được để trống"),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
  start_date: z.date(),
  end_date: z.date(),
  active: z.boolean(),
  usage_limit: z.number().min(0, "Giới hạn sử dụng phải lớn hơn hoặc bằng 0"),
  min_purchase_amount: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0"),
  apply_to_all_products: z.boolean(),
  product_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PromotionFormProps {
  mode: "create" | "edit";
  promotion?: IPromotion;
}

export function PromotionForm({ mode, promotion }: PromotionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";

  const defaultValues: Partial<FormValues> = {
    name: "",
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    active: true,
    usage_limit: 100,
    min_purchase_amount: 100000,
    apply_to_all_products: true,
    product_ids: [],
  };

  // Nếu là mode edit và có promotion, cập nhật defaultValues
  if (isEditing && promotion) {
    defaultValues.name = promotion.name;
    defaultValues.code = promotion.code;
    defaultValues.description = promotion.description;
    defaultValues.discount_type = promotion.discount_type as
      | "percentage"
      | "fixed";
    defaultValues.discount_value = promotion.discount_value;
    defaultValues.start_date = new Date(promotion.start_date);
    defaultValues.end_date = new Date(promotion.end_date);
    defaultValues.active = promotion.active;
    defaultValues.usage_limit = promotion.usage_limit;
    defaultValues.min_purchase_amount = promotion.min_purchase_amount;
    defaultValues.apply_to_all_products = promotion.apply_to_all_products;
    defaultValues.product_ids = promotion.product_ids || [];
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu để gửi lên API
      const promotionData = {
        name: data.name,
        code: data.code,
        description: data.description || "",
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        active: data.active,
        usage_limit: data.usage_limit,
        min_purchase_amount: data.min_purchase_amount,
        apply_to_all_products: data.apply_to_all_products,
        product_ids: data.product_ids || [],
      };

      let result;

      if (isEditing && promotion) {
        // Cập nhật khuyến mãi hiện có
        result = await updatePromotion(promotion._id, promotionData);
        if (result.success) {
          toast.success("Cập nhật khuyến mãi thành công");
          router.push(`/dashboard/promotions/${promotion._id}`);
          router.refresh();
        } else {
          toast.error("Không thể cập nhật khuyến mãi. Vui lòng thử lại.");
        }
      } else {
        // Tạo mới khuyến mãi
        result = await createPromotion(promotionData);
        if (result.success) {
          toast.success("Tạo mới khuyến mãi thành công");
          router.push(`/dashboard/promotions/${result.data?._id}`);
          router.refresh();
        } else {
          toast.error("Không thể tạo khuyến mãi. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Đã xảy ra lỗi khi lưu khuyến mãi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="discount">Thiết lập giảm giá</TabsTrigger>
            <TabsTrigger value="products">Áp dụng sản phẩm</TabsTrigger>
            <TabsTrigger value="limits">Giới hạn & Điều kiện</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cơ bản */}
          <TabsContent value="basic" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thiết lập thông tin chung cho khuyến mãi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên khuyến mãi</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên khuyến mãi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tên gọi của khuyến mãi, hiển thị cho khách hàng khi áp
                        dụng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã khuyến mãi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã khuyến mãi (ví dụ: SUMMER25)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mã sử dụng để áp dụng khuyến mãi, khách hàng cần nhập
                        khi thanh toán
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả khuyến mãi"
                          {...field}
                          value={field.value || ""}
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả chi tiết về khuyến mãi, giúp khách hàng hiểu rõ
                        hơn về ưu đãi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Trạng thái hoạt động
                        </FormLabel>
                        <FormDescription>
                          Khuyến mãi có hoạt động ngay hay không
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab thiết lập giảm giá */}
          <TabsContent value="discount" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thiết lập giảm giá</CardTitle>
                <CardDescription>
                  Cấu hình loại giảm giá và giá trị
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="discount_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại giảm giá</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại giảm giá" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Phần trăm (%)
                            </SelectItem>
                            <SelectItem value="fixed">
                              Giá trị cố định (VND)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chọn loại giảm giá phù hợp với chiến lược của bạn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị giảm giá</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={
                              form.watch("discount_type") === "percentage"
                                ? "Nhập % giảm giá (VD: 10 cho 10%)"
                                : "Nhập số tiền giảm giá (VND)"
                            }
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {form.watch("discount_type") === "percentage"
                            ? "Giá trị từ 1-100, tương ứng với % giảm giá"
                            : "Số tiền giảm giá cố định cho mỗi đơn hàng"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Thời điểm khuyến mãi bắt đầu có hiệu lực
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Thời điểm khuyến mãi hết hiệu lực
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab áp dụng sản phẩm */}
          <TabsContent value="products" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Áp dụng cho sản phẩm</CardTitle>
                <CardDescription>
                  Chọn sản phẩm sẽ được áp dụng khuyến mãi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="apply_to_all_products"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Áp dụng cho tất cả sản phẩm
                        </FormLabel>
                        <FormDescription>
                          Khuyến mãi sẽ áp dụng cho tất cả sản phẩm trong cửa
                          hàng
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!form.watch("apply_to_all_products") && (
                  <FormField
                    control={form.control}
                    name="product_ids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn sản phẩm áp dụng</FormLabel>
                        <FormControl>
                          <ProductSelector
                            selectedProductIds={field.value || []}
                            onSelectedProductsChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Khuyến mãi sẽ chỉ áp dụng cho các sản phẩm được chọn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab giới hạn & điều kiện */}
          <TabsContent value="limits" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Giới hạn & Điều kiện</CardTitle>
                <CardDescription>
                  Thiết lập giới hạn sử dụng và điều kiện áp dụng khuyến mãi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="usage_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới hạn sử dụng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Số lần tối đa"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Số lần tối đa khuyến mãi có thể được sử dụng
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_purchase_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="VND"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Đơn hàng phải có giá trị tối thiểu để áp dụng khuyến
                          mãi này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              isEditing && promotion
                ? router.push(`/dashboard/promotions/${promotion._id}`)
                : router.push("/dashboard/promotions")
            }
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {isEditing ? "Cập nhật" : "Tạo khuyến mãi"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PromotionForm;
