"use client";

import React, { useEffect, useState } from "react";
import {
  getShippingFees,
  updateShippingFees,
} from "../../actions/shipping/shipping-actions";
import {
  ShippingConfigPayload,
  ShippingConfigData,
  ShippingItemFees,
  ShippingFeesType,
} from "../../types/shipping/shipping";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCategories } from "@/features/categories/actions/category-action";

// Component imports
import ShippingFeesTab from "./tabs/shipping-fees-tab";
import ItemVariantsTab from "./tabs/item-variants-tab";
import EditFeeDialog from "./dialogs/edit-fee-dialog";
import AddHeavyItemDialog from "./dialogs/add-heavy-item-dialog";
import AddMethodDialog from "./dialogs/add-method-dialog";
import AdditionalFeesTab from "./tabs/additional-fees-tab";

const ShippingSection = () => {
  const [shippingData, setShippingData] =
    useState<ShippingConfigPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItemType, setEditItemType] = useState<
    "shipping" | "additional" | ""
  >("");
  const [editMethod, setEditMethod] = useState<string>("");
  const [openHeavyItemsDialog, setOpenHeavyItemsDialog] = useState(false);
  const [openMethodsDialog, setOpenMethodsDialog] = useState(false);
  const [newHeavyItem, setNewHeavyItem] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [newMethodPricing, setNewMethodPricing] = useState({
    shipping: {
      lightItems: 0,
      heavyItems: 0,
    },
    additional: {
      lightItems: 0,
      heavyItems: 0,
    },
  });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [tempValues, setTempValues] = useState({
    lightItems: 0,
    heavyItems: 0,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch shipping data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getShippingFees();
        if (response.payload) {
          setShippingData(response.payload);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch shipping fees",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch categories for selection
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const response = await getCategories({ page: "1", limit: "100" });
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleOpenDialog = (
    type: "shipping" | "additional",
    method: string
  ) => {
    setEditItemType(type);
    setEditMethod(method);

    // Convert method name to uppercase for object key
    const methodKey = method.toUpperCase();

    const fees =
      type === "shipping"
        ? shippingData?.shipping_fees[methodKey as keyof ShippingFeesType]
        : shippingData?.additional_item_fees[
            methodKey as keyof ShippingFeesType
          ];

    setTempValues({
      lightItems: fees?.LIGHT_ITEMS || 0,
      heavyItems: fees?.HEAVY_ITEMS || 0,
    });

    setOpenDialog(true);
  };

  const handleAddHeavyItem = () => {
    if (!newHeavyItem.trim()) return;

    if (
      shippingData &&
      !shippingData.heavy_item_variants.includes(newHeavyItem)
    ) {
      const updatedData = {
        ...shippingData,
        heavy_item_variants: [
          ...shippingData.heavy_item_variants,
          newHeavyItem,
        ],
      };
      setShippingData(updatedData);
      handleUpdateShipping(updatedData);
      setNewHeavyItem("");
      setOpenHeavyItemsDialog(false);
    }
  };

  const handleSelectCategory = (categoryName: string) => {
    setNewHeavyItem(categoryName);
  };

  const handleRemoveHeavyItem = (item: string) => {
    if (shippingData) {
      const updatedData = {
        ...shippingData,
        heavy_item_variants: shippingData.heavy_item_variants.filter(
          (variant) => variant !== item
        ),
      };
      setShippingData(updatedData);
      handleUpdateShipping(updatedData);
    }
  };

  const handleAddMethod = () => {
    if (!newMethod.trim()) return;

    if (
      shippingData &&
      !shippingData.shipping_methods
        .map((m) => m.toUpperCase())
        .includes(newMethod.toUpperCase())
    ) {
      // Create the method key (uppercase version of the method name)
      const methodKey = newMethod.toUpperCase();

      // Create new pricing entries for the new method
      const updatedShippingFees = {
        ...shippingData.shipping_fees,
        [methodKey]: {
          LIGHT_ITEMS: newMethodPricing.shipping.lightItems,
          HEAVY_ITEMS: newMethodPricing.shipping.heavyItems,
        },
      };

      const updatedAdditionalFees = {
        ...shippingData.additional_item_fees,
        [methodKey]: {
          LIGHT_ITEMS: newMethodPricing.additional.lightItems,
          HEAVY_ITEMS: newMethodPricing.additional.heavyItems,
        },
      };

      const updatedMethods = [...shippingData.shipping_methods, newMethod];

      const updatedData = {
        ...shippingData,
        shipping_methods: updatedMethods,
        shipping_fees: updatedShippingFees,
        additional_item_fees: updatedAdditionalFees,
      };

      setShippingData(updatedData);
      handleUpdateShipping(updatedData);
      setNewMethod("");
      setNewMethodPricing({
        shipping: { lightItems: 0, heavyItems: 0 },
        additional: { lightItems: 0, heavyItems: 0 },
      });
      setOpenMethodsDialog(false);

      toast({
        title: "Success",
        description: `Added new shipping method: ${newMethod}`,
      });
    }
  };

  const handleRemoveMethod = (method: string) => {
    if (shippingData) {
      const methodKey = method.toUpperCase();

      // Filter out method from shipping_methods array
      const updatedMethods = shippingData.shipping_methods.filter(
        (m) => m !== method
      );

      // Remove pricing entries for this method
      const { [methodKey]: removedShipping, ...remainingShippingFees } =
        shippingData.shipping_fees as any;
      const { [methodKey]: removedAdditional, ...remainingAdditionalFees } =
        shippingData.additional_item_fees as any;

      const updatedData = {
        ...shippingData,
        shipping_methods: updatedMethods,
        shipping_fees: remainingShippingFees as ShippingFeesType,
        additional_item_fees: remainingAdditionalFees as ShippingFeesType,
      };

      setShippingData(updatedData);
      handleUpdateShipping(updatedData);

      toast({
        title: "Success",
        description: `Removed shipping method: ${method}`,
      });
    }
  };

  const handleFeeUpdate = () => {
    if (!shippingData || !editItemType || !editMethod) return;

    // Convert method name to uppercase for object key
    const methodKey = editMethod.toUpperCase();

    const updatedData = { ...shippingData };

    if (editItemType === "shipping") {
      updatedData.shipping_fees = {
        ...updatedData.shipping_fees,
        [methodKey]: {
          ...(updatedData.shipping_fees[methodKey as keyof ShippingFeesType] ||
            {}),
          LIGHT_ITEMS: tempValues.lightItems,
          HEAVY_ITEMS: tempValues.heavyItems,
        },
      } as ShippingFeesType;
    } else {
      updatedData.additional_item_fees = {
        ...updatedData.additional_item_fees,
        [methodKey]: {
          ...(updatedData.additional_item_fees[
            methodKey as keyof ShippingFeesType
          ] || {}),
          LIGHT_ITEMS: tempValues.lightItems,
          HEAVY_ITEMS: tempValues.heavyItems,
        },
      } as ShippingFeesType;
    }

    setShippingData(updatedData);
    handleUpdateShipping(updatedData);
    setOpenDialog(false);

    toast({
      title: "Success",
      description: `Updated ${editItemType} fees for ${editMethod}`,
    });
  };

  const handleUpdateShipping = async (data: ShippingConfigPayload) => {
    try {
      setIsSubmitting(true);

      const updateData: ShippingConfigData = {
        type: data.type,
        additional_item_fees: data.additional_item_fees,
        heavy_item_variants: data.heavy_item_variants,
        shipping_fees: data.shipping_fees,
        shipping_methods: data.shipping_methods,
      };

      await updateShippingFees(updateData);

      toast({
        title: "Success",
        description: "Shipping fees updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shipping fees",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shippingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p>No shipping data available.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Cấu hình chi phí vận chuyển</CardTitle>
              <CardDescription>
                Cấu hình phí vận chuyển cho các phương thức vận chuyển khác nhau
              </CardDescription>
            </div>
            <Button
              onClick={() => setConfirmDialog(true)}
              className="ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="w-full flex justify-between mb-4">
              <TabsTrigger value="shipping" className="flex-1">
                Phí vận chuyển
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex-1">
                Phí hàng hóa
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex-1">
                Loại hàng hóa & Phương thức
              </TabsTrigger>
            </TabsList>

            {/* Shipping Fees Tab */}
            <TabsContent value="shipping" className="mt-0">
              <ShippingFeesTab
                shippingData={shippingData}
                onEditFee={(method) => handleOpenDialog("shipping", method)}
              />
            </TabsContent>

            {/* Additional Item Fees Tab */}
            <TabsContent value="additional" className="mt-0">
              <AdditionalFeesTab
                shippingData={shippingData}
                onEditFee={(method) => handleOpenDialog("additional", method)}
              />
            </TabsContent>

            {/* Item Variants & Methods Tab */}
            <TabsContent value="variants" className="mt-0 space-y-6">
              <ItemVariantsTab
                shippingData={shippingData}
                categories={categories}
                onAddHeavyItem={() => setOpenHeavyItemsDialog(true)}
                onRemoveHeavyItem={handleRemoveHeavyItem}
                onAddMethod={() => setOpenMethodsDialog(true)}
                onRemoveMethod={handleRemoveMethod}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Fee Dialog */}
      <EditFeeDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editItemType={editItemType}
        editMethod={editMethod}
        tempValues={tempValues}
        onTempValuesChange={setTempValues}
        onSave={handleFeeUpdate}
      />

      {/* Add Heavy Item Dialog */}
      <AddHeavyItemDialog
        open={openHeavyItemsDialog}
        onOpenChange={setOpenHeavyItemsDialog}
        categories={categories}
        loadingCategories={loadingCategories}
        newHeavyItem={newHeavyItem}
        onSelectCategory={handleSelectCategory}
        onAddHeavyItem={handleAddHeavyItem}
        onReset={() => setNewHeavyItem("")}
      />

      {/* Add Shipping Method Dialog */}
      <AddMethodDialog
        open={openMethodsDialog}
        onOpenChange={setOpenMethodsDialog}
        newMethod={newMethod}
        onNewMethodChange={setNewMethod}
        newMethodPricing={newMethodPricing}
        onNewMethodPricingChange={setNewMethodPricing}
        onAddMethod={handleAddMethod}
      />

      {/* Confirm Save Dialog */}
      <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save all changes to the shipping
              configuration?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (shippingData) {
                  handleUpdateShipping(shippingData);
                  setConfirmDialog(false);
                }
              }}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShippingSection;
