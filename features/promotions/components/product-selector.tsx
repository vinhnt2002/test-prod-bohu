"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProductsForSelection } from "@/features/products/actions/product-action";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ProductSelectorProps {
  selectedProductIds: string[];
  onSelectedProductsChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export function ProductSelector({
  selectedProductIds = [],
  onSelectedProductsChange,
  disabled = false,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await getProductsForSelection();
        setProducts(productList.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProduct = (productId: string, selectAll = false) => {
    if (selectAll) {
      if (selectedProductIds.length === products.length) {
        onSelectedProductsChange([]);
        toast.info("Đã bỏ chọn tất cả sản phẩm");
      } else {
        const allProductIds = products.map(
          (product) => product.pre_build_product_id
        );
        onSelectedProductsChange(allProductIds);
        toast.success(`Đã chọn tất cả ${allProductIds.length} sản phẩm`);
      }
      return;
    }

    if (selectedProductIds.includes(productId)) {
      onSelectedProductsChange(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      onSelectedProductsChange([...selectedProductIds, productId]);
    }
  };

  const removeProduct = (productId: string) => {
    onSelectedProductsChange(
      selectedProductIds.filter((id) => id !== productId)
    );
  };

  const removeAllProducts = () => {
    onSelectedProductsChange([]);
    toast.info("Đã bỏ chọn tất cả sản phẩm");
  };

  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.pre_build_product_id)
  );

  const isAllSelected =
    products.length > 0 && selectedProductIds.length === products.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mr-2"
              disabled={disabled}
            >
              <span className="truncate">
                {selectedProducts.length > 0
                  ? `Đã chọn ${selectedProducts.length} sản phẩm`
                  : "Chọn sản phẩm..."}
              </span>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              <div className="flex items-center px-3 py-2 border-b">
                <CommandInput
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-9 flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 h-9"
                  onClick={() => toggleProduct("", true)}
                >
                  {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </Button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Không tìm thấy sản phẩm nào</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[300px]">
                      <CommandList>
                        {filteredProducts.map((product) => (
                          <CommandItem
                            key={product.pre_build_product_id}
                            value={product.pre_build_product_id}
                            className="flex items-center gap-2 py-2"
                            onSelect={() =>
                              toggleProduct(product.pre_build_product_id)
                            }
                          >
                            <div className="flex items-center space-x-2 flex-1">
                              <Checkbox
                                checked={selectedProductIds.includes(
                                  product.pre_build_product_id
                                )}
                                id={`product-${product.pre_build_product_id}`}
                                onCheckedChange={() =>
                                  toggleProduct(product.pre_build_product_id)
                                }
                              />
                              {product.images && product.images.length > 0 && (
                                <div className="h-10 w-10 rounded-md overflow-hidden relative bg-gray-100">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {product.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.price)}
                                </span>
                              </div>
                            </div>
                            {selectedProductIds.includes(
                              product.pre_build_product_id
                            ) && <Check className="h-4 w-4 text-primary" />}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </ScrollArea>
                  </CommandGroup>
                </>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={disabled || selectedProducts.length === 0}
              className="h-10 w-10"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toggleProduct("", true)}
              className="cursor-pointer"
            >
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả sản phẩm"}
            </DropdownMenuItem>
            {selectedProducts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={removeAllProducts}
                  className="cursor-pointer text-red-600"
                >
                  Xóa tất cả đã chọn
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedProducts.map((product) => (
            <Badge
              key={product.pre_build_product_id}
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              <span className="line-clamp-1">{product.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeProduct(product.pre_build_product_id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedProducts.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={removeAllProducts}
              disabled={disabled}
            >
              Xóa tất cả
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSelector;
