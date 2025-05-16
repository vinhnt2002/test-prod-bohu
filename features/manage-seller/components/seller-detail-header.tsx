"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Edit,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DeactivateSellerDialog } from "./dialogs/delete-seller-dialog";

interface SellerDetailHeaderProps {
  seller: IStore;
}

export function SellerDetailHeader({ seller }: SellerDetailHeaderProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Back button and actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href="/dashboard/manage-seller">
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeactivateDialog(true)}
          >
            <Lock className="mr-2 h-4 w-4" />
            <span>Ngưng hoạt động</span>
          </Button>
        </div>
      </div>

      {/* Seller banner and basic info */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
        {seller.banner ? (
          <Image
            src={seller.banner}
            alt={`${seller.name} banner`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Không có ảnh bìa
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo and status */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white bg-white shadow-md -mt-16 relative z-10">
            {seller.logo ? (
              <Image
                src={seller.logo}
                alt={`${seller.name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No Logo
              </div>
            )}
          </div>
          <Badge
            variant={seller.status === "active" ? "default" : "destructive"}
            className={cn("capitalize")}
          >
            {seller.status === "active"
              ? "Hoạt động"
              : seller.status === "pending"
              ? "Chờ duyệt"
              : "Đã khóa"}
          </Badge>
        </div>

        {/* Seller info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{seller.name}</h1>
            <p className="text-muted-foreground">{seller.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{seller.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{seller.contact.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span>
                      {seller.address.street}, {seller.address.city},{" "}
                      {seller.address.state}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social media */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Mạng xã hội</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span>
                      {seller.social.facebook ? (
                        <a
                          href={seller.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span>
                      {seller.social.instagram ? (
                        <a
                          href={seller.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                        >
                          Instagram
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span>
                      {seller.social.twitter ? (
                        <a
                          href={seller.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Twitter
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có</span>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Metrics */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Thống kê</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Sản phẩm</div>
                  <div className="text-lg font-bold">
                    {seller.metrics.totalProducts}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Đơn hàng</div>
                  <div className="text-lg font-bold">
                    {seller.metrics.totalOrders}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md col-span-2">
                  <div className="text-sm text-gray-500">Doanh thu</div>
                  <div className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(seller.metrics.totalRevenue)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md col-span-2">
                  <div className="text-sm text-gray-500">Đánh giá</div>
                  <div className="text-lg font-bold flex items-center">
                    {seller.metrics.averageRating.toFixed(1)}{" "}
                    <span className="ml-1 text-yellow-400">⭐</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showDeactivateDialog && (
        <DeactivateSellerDialog
          open={showDeactivateDialog}
          onOpenChange={setShowDeactivateDialog}
          seller={seller}
        />
      )}
    </div>
  );
}
