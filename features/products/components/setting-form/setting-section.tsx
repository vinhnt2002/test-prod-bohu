"use client";

import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { usePricingLogic } from "@/hooks/use-pricing-logic";
import { useState, useEffect, useMemo } from "react";
import PricingHeader from "./pricing-header";
import EmptyState from "./empty-state";
import GridView from "./grid-view";
import TabsView from "./tabs-view";
import PricingFooter from "./pricing-footer";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import EditPriceModal from "../modals/edit-pricing";
import AddSizeModal from "../modals/add-size";
import { toast } from "sonner";
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
import { buttonVariants } from "@/components/ui/button";

// DeleteProductTypeDialog component
interface DeleteProductTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType: string;
  onConfirm: (productType: string) => void;
}

const DeleteProductTypeDialog = ({
  open,
  onOpenChange,
  productType,
  onConfirm,
}: DeleteProductTypeDialogProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    try {
      setIsPending(true);
      await onConfirm(productType);
      toast.success(`Đã xóa loại sản phẩm "${productType}"`);
    } catch (error) {
      console.error("Error deleting product type:", error);
      toast.error("Đã xảy ra lỗi khi xóa loại sản phẩm");
    } finally {
      setIsPending(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa loại sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa loại sản phẩm{" "}
            <span className="font-semibold">"{productType}"</span>?
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu giá liên
            quan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isPending ? "Đang xử lý..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PricingSection = () => {
  const {
    activeTab,
    setActiveTab,
    pricingData,
    isLoading,
    error,
    pricingTypes,
    handleEditPrice,
    handleAddSize,
    handleAddNewType,
    handleDeleteType,
    handleBulkEdit,
    isEditPriceModalOpen,
    setIsEditPriceModalOpen,
    isEditSizeModalOpen,
    setIsEditSizeModalOpen,
    currentProductType,
    currentSide,
    currentSize,
    newPrice,
    setNewPrice,
    newSize,
    setNewSize,
    handleSavePrice,
    handleSaveSize,
  } = usePricingLogic();

  // Add new state for product type search/filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Add state for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState("");

  // Filter product types based on search query
  const filteredProductTypes = useMemo(() => {
    if (!searchQuery.trim()) return pricingTypes;
    return pricingTypes.filter((type) =>
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pricingTypes, searchQuery]);

  // Set first filtered product type as active when filter changes
  useEffect(() => {
    if (
      filteredProductTypes.length > 0 &&
      !filteredProductTypes.includes(activeTab)
    ) {
      setActiveTab(filteredProductTypes[0]);
    }
  }, [filteredProductTypes, activeTab, setActiveTab]);

  // Handle product type deletion with confirmation
  const handleConfirmDeleteType = async (productType: string) => {
    try {
      await handleDeleteType(productType);

      // If the deleted product was the active tab, select a new active tab
      if (productType === activeTab && pricingTypes.length > 0) {
        const newActiveTab =
          pricingTypes.find((type) => type !== productType) || pricingTypes[0];
        setActiveTab(newActiveTab);
      }

      return true;
    } catch (error) {
      console.error("Error deleting product type:", error);
      return false;
    }
  };

  // Xác nhận trước khi xóa
  const confirmDeleteType = (productType: string) => {
    setProductTypeToDelete(productType);
    setIsDeleteDialogOpen(true);
  };

  // Add state for view mode
  const [viewMode, setViewMode] = useState<"tabs" | "grid">("tabs");

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Calculate total sizes for all product types
  const totalSizes = pricingTypes.reduce((total, type) => {
    return (
      total +
      Object.keys(pricingData![type].one_side).length +
      Object.keys(pricingData![type].two_side).length
    );
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border shadow-sm">
        <PricingHeader
          pricingTypesCount={pricingTypes.length}
          sizesCount={totalSizes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleAddNewType={handleAddNewType}
        />

        {pricingTypes.length === 0 ? (
          <EmptyState handleAddNewType={handleAddNewType} />
        ) : viewMode === "grid" ? (
          <GridView
            filteredProductTypes={filteredProductTypes}
            pricingTypes={pricingTypes}
            pricingData={pricingData!}
            handleBulkEdit={handleBulkEdit}
            confirmDeleteType={confirmDeleteType}
            handleAddSize={handleAddSize}
            setActiveTab={setActiveTab}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showSearchInput={showSearchInput}
            setShowSearchInput={setShowSearchInput}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
            key={`tabs-container-${pricingTypes.length}`}
          >
            <TabsView
              pricingTypes={pricingTypes}
              filteredProductTypes={filteredProductTypes}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pricingData={pricingData!}
              handleEditPrice={handleEditPrice}
              handleAddSize={handleAddSize}
              confirmDeleteType={confirmDeleteType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showSearchInput={showSearchInput}
              setShowSearchInput={setShowSearchInput}
              onAddSize={setIsEditSizeModalOpen}
            />
            <PricingFooter
              pricingTypes={pricingTypes}
              pricingData={pricingData!}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowSearchInput={setShowSearchInput}
              setActiveTab={setActiveTab}
              handleAddNewType={handleAddNewType}
            />
          </Tabs>
        )}
      </Card>

      {/* Modals */}
      <EditPriceModal
        isOpen={isEditPriceModalOpen}
        onOpenChange={setIsEditPriceModalOpen}
        productType={currentProductType}
        side={currentSide}
        size={currentSize}
        price={newPrice}
        setPrice={setNewPrice}
        onSave={handleSavePrice}
      />
      <AddSizeModal
        isOpen={isEditSizeModalOpen}
        onOpenChange={setIsEditSizeModalOpen}
        productType={currentProductType}
        side={currentSide}
        size={newSize}
        setSize={setNewSize}
        price={newPrice}
        setPrice={setNewPrice}
        onSave={handleSaveSize}
      />

      {/* Delete Product Type Dialog */}
      <DeleteProductTypeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productType={productTypeToDelete}
        onConfirm={handleConfirmDeleteType}
      />
    </div>
  );
};

export default PricingSection;
