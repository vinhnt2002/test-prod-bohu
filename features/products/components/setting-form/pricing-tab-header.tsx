import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface PricingTabHeaderProps {
  pricingTypes: string[];
  filteredProductTypes: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
}

const PricingTabHeader = ({
  pricingTypes,
  filteredProductTypes,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
}: PricingTabHeaderProps) => {
  return (
    <div className="px-4 py-2 bg-muted/10 border-y sticky top-0 z-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Loại sản phẩm{" "}
          {pricingTypes.length > 15 &&
            `(${filteredProductTypes.length}/${pricingTypes.length})`}
        </h3>
        <div className="flex items-center gap-2">
          {showSearchInput ? (
            <div className="flex items-center">
              <Input
                placeholder="Tìm loại sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-[200px] text-sm focus-visible:ring-primary"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchInput(false);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSearchInput(true)}
            >
              <Search size={14} />
            </Button>
          )}

          {/* Product Type Dropdown for many types */}
          {pricingTypes.length > 15 && (
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="h-8 w-[180px] border-muted">
                <SelectValue placeholder="Chọn loại sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Loại sản phẩm</SelectLabel>
                  {pricingTypes.map((type) => (
                    <SelectItem key={`select-${type}`} value={type}>
                      {type}
                      {pricingTypes[0] === type && (
                        <span className="ml-2 text-xs text-yellow-500">★</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Show horizontal tabs only when we have a reasonable number */}
      {(pricingTypes.length <= 15 || filteredProductTypes.length > 0) && (
        <ScrollArea className="w-full pb-1">
          <TabsList className="flex h-9 w-full bg-transparent p-0 gap-2">
            {filteredProductTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="relative px-4 py-1.5 h-9 text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:font-medium data-[state=active]:text-primary transition-all overflow-hidden group"
              >
                {/* Background highlight */}
                <motion.div
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  initial={false}
                  animate={activeTab === type ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Animated bottom border/line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary -z-10"
                  initial={false}
                  animate={
                    activeTab === type
                      ? { opacity: 1, width: "100%" }
                      : { opacity: 0, width: "0%" }
                  }
                  transition={{ duration: 0.2 }}
                />

                {/* Tab content */}
                <div className="flex items-center gap-2 relative z-10">
                  <span
                    className={`relative ${
                      activeTab === type ? "text-white" : "text-dark"
                    }`}
                  >
                    {type}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-primary rounded-full"
                      initial={false}
                      animate={
                        activeTab === type
                          ? { opacity: 1, scaleX: 1 }
                          : { opacity: 0, scaleX: 0 }
                      }
                      transition={{ duration: 0.2 }}
                    />
                  </span>
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/5 rounded-md -z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={activeTab === type ? { opacity: 0 } : { opacity: 0 }}
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      )}

      {/* No results message */}
      {filteredProductTypes.length === 0 && (
        <div className="py-2 text-center text-muted-foreground text-sm">
          Không tìm thấy loại sản phẩm phù hợp
        </div>
      )}
    </div>
  );
};

export default PricingTabHeader;
