"use client";

import { Shell } from "@/components/shared/custom-ui/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategories } from "@/features/categories/actions/category-action";
import { usePricingLogic } from "@/hooks/use-pricing-logic";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  DollarSign,
  PlusCircle,
  RulerIcon,
  Save,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddTypePage() {
  const router = useRouter();
  const {
    newTypeName,
    setNewTypeName,
    newTypeOneSideData,
    setNewTypeOneSideData,
    newTypeTwoSideData,
    setNewTypeTwoSideData,
    handleNewTypeDataChange,
    handleAddNewTypeRow,
    handleRemoveNewTypeRow,
    handleSaveNewType,
    isLoading: isPricingLoading,
  } = usePricingLogic();

  const [activeTab, setActiveTab] = useState<string>("one_side");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setIsLoadingCategories(true);
        const result = await getCategories({ page: "1", limit: "100" });
        if (result && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Không thể tải danh mục sản phẩm");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  // Validate data
  const isCategorySelected = selectedCategoryId !== "";
  const isOneSideDataValid = newTypeOneSideData.every(
    (item) => item.size.trim().length > 0 && Number(item.price) >= 0
  );
  const isTwoSideDataValid = newTypeTwoSideData.every(
    (item) => item.size.trim().length > 0 && Number(item.price) >= 0
  );

  const hasOneSideData = newTypeOneSideData.length > 0;
  const hasTwoSideData = newTypeTwoSideData.length > 0;
  const hasData = hasOneSideData || hasTwoSideData;

  const canSave =
    isCategorySelected && isOneSideDataValid && isTwoSideDataValid && hasData;

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      setNewTypeName(category.name);
    }
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      await handleSaveNewType();
      router.push("/dashboard/products/settings");
    } catch (error) {
      console.error("Failed to save new product type:", error);
    }
  };

  const isLoading = isPricingLoading || isLoadingCategories;

  // Find selected category for display
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
              <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin animation-delay-700"></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products">
                Sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products/settings">
                Cài đặt
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>Thêm loại sản phẩm</BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Thêm loại sản phẩm
              </h1>
              <p className="text-muted-foreground">
                Tạo loại sản phẩm mới và định nghĩa các kích cỡ cùng giá tiền
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/products/settings")}
                className="gap-1"
              >
                <ArrowLeft size={16} />
                Quay lại
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="gap-1"
              >
                <Save size={16} />
                Lưu
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin loại sản phẩm</CardTitle>
            <CardDescription>
              Chọn danh mục sản phẩm cho loại sản phẩm mới
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Danh mục sản phẩm
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between mt-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">
                        {selectedCategory
                          ? selectedCategory.name
                          : "Chọn danh mục sản phẩm..."}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Tìm kiếm danh mục..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy danh mục nào</CommandEmpty>
                      <CommandGroup heading="Danh mục sản phẩm">
                        {filteredCategories.map((category) => (
                          <CommandItem
                            key={category._id}
                            value={category.id}
                            onSelect={() => handleSelectCategory(category.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategoryId === category.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {!isCategorySelected && (
                <p className="text-sm text-destructive mt-1.5">
                  Vui lòng chọn danh mục sản phẩm
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách kích cỡ và giá</CardTitle>
            <CardDescription>
              Thiết lập kích cỡ và giá cho từng loại in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one_side" className="rounded-lg">
                  <Badge variant="default" className="mr-2">
                    {newTypeOneSideData.length}
                  </Badge>
                  In một mặt
                </TabsTrigger>
                <TabsTrigger value="two_side" className="rounded-lg">
                  <Badge variant="secondary" className="mr-2">
                    {newTypeTwoSideData.length}
                  </Badge>
                  In hai mặt
                </TabsTrigger>
              </TabsList>

              <TabsContent value="one_side" className="pt-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Kích cỡ và giá (in một mặt)
                    </Label>
                    <Badge variant="outline" className="bg-muted/30">
                      {newTypeOneSideData.length} kích cỡ
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pe-2">
                    {newTypeOneSideData.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              value={item.size}
                              onChange={(e) =>
                                handleNewTypeDataChange(
                                  "one_side",
                                  index,
                                  "size",
                                  e.target.value
                                )
                              }
                              placeholder="Kích cỡ"
                              className="pl-9"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <RulerIcon
                                size={14}
                                className="text-muted-foreground"
                              />
                            </div>
                          </div>
                          {!item.size.trim() && (
                            <p className="text-xs text-destructive mt-1">
                              Vui lòng nhập kích cỡ
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleNewTypeDataChange(
                                  "one_side",
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="Giá"
                              className="pl-9"
                              min="0"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <DollarSign
                                size={14}
                                className="text-muted-foreground"
                              />
                            </div>
                          </div>
                          {(isNaN(Number(item.price)) ||
                            Number(item.price) < 0) && (
                            <p className="text-xs text-destructive mt-1">
                              Giá không hợp lệ
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                          onClick={() =>
                            handleRemoveNewTypeRow("one_side", index)
                          }
                        >
                          <Trash size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddNewTypeRow("one_side")}
                  >
                    <PlusCircle size={14} className="mr-2" />
                    Thêm kích cỡ
                  </Button>

                  {!isOneSideDataValid && newTypeOneSideData.length > 0 && (
                    <Alert variant="default" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Đảm bảo tất cả kích cỡ có tên và giá hợp lệ
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="two_side" className="pt-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Kích cỡ và giá (in hai mặt)
                    </Label>
                    <Badge variant="outline" className="bg-muted/30">
                      {newTypeTwoSideData.length} kích cỡ
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pe-2">
                    {newTypeTwoSideData.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              value={item.size}
                              onChange={(e) =>
                                handleNewTypeDataChange(
                                  "two_side",
                                  index,
                                  "size",
                                  e.target.value
                                )
                              }
                              placeholder="Kích cỡ"
                              className="pl-9"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <RulerIcon
                                size={14}
                                className="text-muted-foreground"
                              />
                            </div>
                          </div>
                          {!item.size.trim() && (
                            <p className="text-xs text-destructive mt-1">
                              Vui lòng nhập kích cỡ
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleNewTypeDataChange(
                                  "two_side",
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="Giá"
                              className="pl-9"
                              min="0"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <DollarSign
                                size={14}
                                className="text-muted-foreground"
                              />
                            </div>
                          </div>
                          {(isNaN(Number(item.price)) ||
                            Number(item.price) < 0) && (
                            <p className="text-xs text-destructive mt-1">
                              Giá không hợp lệ
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                          onClick={() =>
                            handleRemoveNewTypeRow("two_side", index)
                          }
                        >
                          <Trash size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddNewTypeRow("two_side")}
                  >
                    <PlusCircle size={14} className="mr-2" />
                    Thêm kích cỡ
                  </Button>

                  {!isTwoSideDataValid && newTypeTwoSideData.length > 0 && (
                    <Alert variant="default" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Đảm bảo tất cả kích cỡ có tên và giá hợp lệ
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {!hasData && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vui lòng thêm ít nhất một kích cỡ cho loại in một mặt hoặc hai
                  mặt
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/products/settings")}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!canSave} className="gap-1.5">
            <Save size={16} />
            Lưu loại sản phẩm
          </Button>
        </div>
      </div>
    </Shell>
  );
}
