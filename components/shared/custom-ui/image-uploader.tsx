"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Plus, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const DEFAULT_IMAGE =
  "https://via.placeholder.com/300x200?text=Hình+ảnh+không+khả+dụng";

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  className,
}: ImageUploaderProps) {
  const { data: session } = useSession();
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State để theo dõi các hình ảnh bị lỗi
  const [brokenImages, setBrokenImages] = useState<{
    [key: number]: boolean;
  }>({});

  // Xử lý khi một hình ảnh không thể tải được
  const handleImageError = (index: number) => {
    setBrokenImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Xử lý thêm hình ảnh mới từ URL
  const handleAddImageFromUrl = () => {
    if (newImageUrl && newImageUrl.trim() !== "") {
      try {
        // Validate URL
        new URL(newImageUrl);

        if (!images.includes(newImageUrl)) {
          if (images.length >= maxImages) {
            toast.error(`Chỉ có thể tải lên tối đa ${maxImages} hình ảnh`);
            return;
          }

          onImagesChange([...images, newImageUrl]);
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

  // Xử lý tải lên hình ảnh từ máy tính
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      for (let i = 0; i < files.length; i++) {
        if (images.length >= maxImages) {
          toast.error(`Chỉ có thể tải lên tối đa ${maxImages} hình ảnh`);
          break;
        }

        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File "${file.name}" không phải là hình ảnh`);
          continue;
        }

        const formData = new FormData();
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
        onImagesChange([...images, url]);
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

  // Xử lý xóa hình ảnh
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onImagesChange(updatedImages);

    // Xóa khỏi danh sách hình ảnh bị lỗi nếu có
    if (brokenImages[index]) {
      const updatedBrokenImages = { ...brokenImages };
      delete updatedBrokenImages[index];
      setBrokenImages(updatedBrokenImages);
    }

    toast.success("Đã xóa hình ảnh khỏi danh sách");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Danh sách hình ảnh</Label>
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
            {images.length} hình ảnh
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

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 py-6">
            <ImageIcon size={24} className="text-muted-foreground mb-2" />
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
              <div className="flex flex-wrap gap-3 p-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group relative rounded-md overflow-hidden border h-40 w-40 bg-muted/20",
                      brokenImages[index] && "border-amber-400"
                    )}
                  >
                    <Image
                      src={brokenImages[index] ? DEFAULT_IMAGE : image}
                      width={160}
                      height={160}
                      alt={`Hình ảnh ${index + 1}`}
                      onError={() => handleImageError(index)}
                      className={cn(
                        "h-full w-full object-cover",
                        brokenImages[index] && "opacity-70"
                      )}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-60 hover:opacity-100"
                      onClick={() => handleRemoveImage(index)}
                      title="Xóa hình ảnh"
                    >
                      <X size={14} />
                    </Button>

                    {/* Error indicator */}
                    {brokenImages[index] && (
                      <div className="absolute bottom-1 left-1 bg-amber-100 text-amber-700 text-xs rounded px-1 py-0.5 flex items-center">
                        <AlertTriangle size={10} className="mr-1" />
                        Lỗi
                      </div>
                    )}
                  </div>
                ))}

                {/* Add more button */}
                {images.length < maxImages && (
                  <div
                    className="flex flex-col items-center justify-center h-40 w-40 border border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus size={20} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Thêm hình ảnh
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </Card>

      <div className="text-xs text-muted-foreground mt-1">
        <p>
          Chọn file hoặc nhập URL để thêm hình ảnh. Hỗ trợ: JPG, PNG, GIF, WebP.
        </p>
      </div>
    </div>
  );
}
