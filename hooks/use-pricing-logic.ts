import {
  fetchPricingData,
  updatePricingData,
} from "@/features/products/services/pricing-service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface SizePricePair {
  size: string;
  price: string;
}

export interface PricingDataType {
  [key: string]: {
    one_side: { [size: string]: number };
    two_side: { [size: string]: number };
  };
}

export const usePricingLogic = () => {
  const [activeTab, setActiveTab] = useState<string>("T-Shirt");
  const [pricingData, setPricingData] = useState<PricingDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [isEditSizeModalOpen, setIsEditSizeModalOpen] = useState(false);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [currentProductType, setCurrentProductType] = useState<string>("");
  const [currentSide, setCurrentSide] = useState<"one_side" | "two_side">(
    "one_side"
  );
  const [currentSize, setCurrentSize] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [bulkEditData, setBulkEditData] = useState<SizePricePair[]>([]);
  const [newTypeOneSideData, setNewTypeOneSideData] = useState<SizePricePair[]>(
    [{ size: "", price: "" }]
  );
  const [newTypeTwoSideData, setNewTypeTwoSideData] = useState<SizePricePair[]>(
    [{ size: "", price: "" }]
  );

  const loadPricingData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchPricingData();
      const configData: PricingDataType = response.payload;
      setPricingData(configData);
      if (Object.keys(response.payload).length > 0) {
        setActiveTab(Object.keys(response.payload)[0]);
      }
      return true;
    } catch (err) {
      setError("Không thể tải dữ liệu giá. Vui lòng thử lại sau.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    return await loadPricingData();
  };

  useEffect(() => {
    loadPricingData();
  }, []);

  const pricingTypes = pricingData ? Object.keys(pricingData) : [];

  const handleEditPrice = (
    productType: string,
    side: "one_side" | "two_side",
    size: string,
    price: number
  ) => {
    setCurrentProductType(productType);
    setCurrentSide(side);
    setCurrentSize(size);
    setNewPrice(price.toString());
    setIsEditPriceModalOpen(true);
  };

  const handleSavePrice = async () => {
    if (!pricingData || !newPrice || isNaN(parseFloat(newPrice))) return;

    const updatedData = { ...pricingData };
    updatedData[currentProductType][currentSide][currentSize] =
      parseFloat(newPrice);

    try {
      await updatePricingData(updatedData);
      toast.success("Cập nhật giá thành công");
      setPricingData(updatedData);
      setIsEditPriceModalOpen(false);
      setNewPrice("");
    } catch (err) {
      setError("Không thể cập nhật giá. Vui lòng thử lại.");
    }
  };

  const handleAddSize = (
    productType: string,
    side: "one_side" | "two_side"
  ) => {
    setCurrentProductType(productType);
    setCurrentSide(side);
    setNewSize("");
    setNewPrice("");
    setIsEditSizeModalOpen(true);
  };

  const handleSaveSize = async () => {
    if (!pricingData || !newSize || !newPrice || isNaN(parseFloat(newPrice)))
      return;

    const updatedData = { ...pricingData };
    updatedData[currentProductType][currentSide][newSize] =
      parseFloat(newPrice);

    try {
      await updatePricingData(updatedData);
      toast.success("Cập nhật kích cỡ thành công");
      setPricingData(updatedData);
      setIsEditSizeModalOpen(false);
      setNewSize("");
      setNewPrice("");
    } catch (err) {
      setError("Không thể thêm kích thước. Vui lòng thử lại.");
    }
  };

  const handleAddNewType = () => {
    setNewTypeName("");
    setNewTypeOneSideData([{ size: "", price: "" }]);
    setNewTypeTwoSideData([{ size: "", price: "" }]);
    setIsAddTypeModalOpen(true);
  };

  const handleNewTypeDataChange = (
    side: "one_side" | "two_side",
    index: number,
    field: "size" | "price",
    value: string
  ) => {
    const setData =
      side === "one_side" ? setNewTypeOneSideData : setNewTypeTwoSideData;
    const data = side === "one_side" ? newTypeOneSideData : newTypeTwoSideData;
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleAddNewTypeRow = (side: "one_side" | "two_side") => {
    const setData =
      side === "one_side" ? setNewTypeOneSideData : setNewTypeTwoSideData;
    const data = side === "one_side" ? newTypeOneSideData : newTypeTwoSideData;
    setData([...data, { size: "", price: "" }]);
  };

  const handleRemoveNewTypeRow = (
    side: "one_side" | "two_side",
    index: number
  ) => {
    const setData =
      side === "one_side" ? setNewTypeOneSideData : setNewTypeTwoSideData;
    const data = side === "one_side" ? newTypeOneSideData : newTypeTwoSideData;
    setData(data.filter((_, i) => i !== index));
  };

  const handleSaveNewType = async () => {
    if (!pricingData || !newTypeName) return;

    const validOneSide = newTypeOneSideData.every(
      (item) => item.size && item.price && !isNaN(parseFloat(item.price))
    );
    const validTwoSide = newTypeTwoSideData.every(
      (item) => item.size && item.price && !isNaN(parseFloat(item.price))
    );
    if (!validOneSide || !validTwoSide) {
      setError("Vui lòng nhập đầy đủ kích cỡ và giá hợp lệ.");
      return;
    }

    const oneSideSizes: { [size: string]: number } = {};
    newTypeOneSideData.forEach((item) => {
      oneSideSizes[item.size] = parseFloat(item.price);
    });

    const twoSideSizes: { [size: string]: number } = {};
    newTypeTwoSideData.forEach((item) => {
      twoSideSizes[item.size] = parseFloat(item.price);
    });

    const updatedData = {
      ...pricingData,
      [newTypeName]: {
        one_side: oneSideSizes,
        two_side: twoSideSizes,
      },
    };

    try {
      await updatePricingData(updatedData);
      toast.success("Thêm loại mới thành công");
      setPricingData(updatedData);
      setActiveTab(newTypeName);
      setIsAddTypeModalOpen(false);
      setNewTypeName("");
      setNewTypeOneSideData([{ size: "", price: "" }]);
      setNewTypeTwoSideData([{ size: "", price: "" }]);
    } catch (err) {
      setError("Không thể thêm loại mới. Vui lòng thử lại.");
    }
  };

  const handleDeleteType = async (type: string) => {
    if (!pricingData) return false;

    const updatedData = { ...pricingData };
    delete updatedData[type];

    try {
      const response = await updatePricingData(updatedData);
      console.log("Delete response:", response);

      if (response && response.payload) {
        setPricingData({ ...response.payload });

        if (activeTab === type && Object.keys(response.payload).length > 0) {
          setActiveTab(Object.keys(response.payload)[0]);
        }

        return true;
      }
      return false;
    } catch (err) {
      setError("Không thể xóa loại. Vui lòng thử lại.");
      return false;
    }
  };

  const handleBulkEdit = (
    productType: string,
    side: "one_side" | "two_side"
  ) => {
    setCurrentProductType(productType);
    setCurrentSide(side);
    const sizes = Object.entries(pricingData![productType][side]).map(
      ([size, price]) => ({
        size,
        price: price.toString(),
      })
    );
    setBulkEditData(sizes);
    setIsBulkEditModalOpen(true);
  };

  const handleBulkEditChange = (
    index: number,
    field: "size" | "price",
    value: string
  ) => {
    const updatedData = [...bulkEditData];
    updatedData[index][field] = value;
    setBulkEditData(updatedData);
  };

  const handleAddBulkEditRow = () => {
    setBulkEditData([...bulkEditData, { size: "", price: "" }]);
  };

  const handleRemoveBulkEditRow = (index: number) => {
    const updatedData = bulkEditData.filter((_, i) => i !== index);
    setBulkEditData(updatedData);
  };

  const handleSaveBulkEdit = async (
    productTypeParam?: string,
    sideParam?: "one_side" | "two_side"
  ) => {
    if (!pricingData) return;
    const validData = bulkEditData.every(
      (item) => item.size && item.price && !isNaN(parseFloat(item.price))
    );
    if (!validData) {
      setError("Vui lòng nhập đầy đủ kích cỡ và giá hợp lệ.");
      return;
    }

    const productTypeToUse = productTypeParam || currentProductType;
    const sideToUse = sideParam || currentSide;

    if (!productTypeToUse || !pricingData[productTypeToUse]) {
      setError("Loại sản phẩm không hợp lệ hoặc không tồn tại.");
      throw new Error("Invalid product type");
    }

    const updatedData = { ...pricingData };
    const newSizeData: { [size: string]: number } = {};
    bulkEditData.forEach((item) => {
      newSizeData[item.size] = parseFloat(item.price);
    });
    updatedData[productTypeToUse][sideToUse] = newSizeData;

    try {
      await updatePricingData(updatedData);
      toast.success("Cập nhật dữ liệu thành công");
      setPricingData(updatedData);
      setIsBulkEditModalOpen(false);
      setBulkEditData([]);
    } catch (err) {
      setError("Không thể cập nhật dữ liệu. Vui lòng thử lại.");
      throw err;
    }
  };

  return {
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
    isAddTypeModalOpen,
    setIsAddTypeModalOpen,
    isBulkEditModalOpen,
    setIsBulkEditModalOpen,
    currentProductType,
    currentSide,
    currentSize,
    newPrice,
    setNewPrice,
    newSize,
    setNewSize,
    newTypeName,
    setNewTypeName,
    bulkEditData,
    setBulkEditData,
    newTypeOneSideData,
    setNewTypeOneSideData,
    newTypeTwoSideData,
    setNewTypeTwoSideData,
    handleSavePrice,
    handleSaveSize,
    handleSaveNewType,
    handleSaveBulkEdit,
    handleNewTypeDataChange,
    handleAddNewTypeRow,
    handleRemoveNewTypeRow,
    handleBulkEditChange,
    handleAddBulkEditRow,
    handleRemoveBulkEditRow,
    refreshData,
  };
};
