import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Check, Loader2 } from "lucide-react";
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

interface AddHeavyItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ICategory[];
  loadingCategories: boolean;
  newHeavyItem: string;
  onSelectCategory: (categoryName: string) => void;
  onAddHeavyItem: () => void;
  onReset: () => void;
}

const AddHeavyItemDialog = ({
  open,
  onOpenChange,
  categories,
  loadingCategories,
  newHeavyItem,
  onSelectCategory,
  onAddHeavyItem,
  onReset,
}: AddHeavyItemDialogProps) => {
  const [openCategorySelector, setOpenCategorySelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset values when dialog is closed
      setSearchQuery("");
      if (!open) onReset();
    }
    onOpenChange(newOpen);
  };

  const handleSelectAndClose = (categoryName: string) => {
    onSelectCategory(categoryName);
    setOpenCategorySelector(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Heavy Item Variant</DialogTitle>
          <DialogDescription>
            Select a category from the dropdown to add as a heavy item variant.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="heavy-item" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Popover
                open={openCategorySelector}
                onOpenChange={setOpenCategorySelector}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategorySelector}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {newHeavyItem || "Select category..."}
                    </span>
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className="w-full">
                    <div className="flex items-center px-3 py-2 border-b">
                      <CommandInput
                        placeholder="Search categories..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        className="h-9 flex-1"
                      />
                    </div>
                    {loadingCategories ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No categories found</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[300px]">
                            <CommandList>
                              {filteredCategories.map((category) => (
                                <CommandItem
                                  key={category._id}
                                  value={category.id}
                                  className="flex items-center gap-2 py-3 px-4 hover:bg-accent cursor-pointer"
                                  onSelect={() =>
                                    handleSelectAndClose(category.name)
                                  }
                                >
                                  <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {category.name}
                                      </span>
                                      {category.type && (
                                        <Badge
                                          variant="outline"
                                          className="ml-2"
                                        >
                                          {category.type}
                                        </Badge>
                                      )}
                                    </div>

                                    {category.description && (
                                      <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {category.description}
                                      </span>
                                    )}
                                  </div>
                                  {newHeavyItem === category.name && (
                                    <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
                                  )}
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
            </div>
          </div>
          {newHeavyItem && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <p className="text-sm text-muted-foreground">
                  Selected category will be added as a heavy item variant.
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onAddHeavyItem}
            disabled={!newHeavyItem}
            className="ml-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add as Heavy Variant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddHeavyItemDialog;
