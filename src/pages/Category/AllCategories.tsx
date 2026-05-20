import { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  MoreVertical,
  LayoutGrid,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loading } from "@/components/shared/Loading";
import { ConfirmDelete } from "@/components/shared/ConfirmDelete";
import { useFetchData } from "@/hooks/useFetchData";
import { categoryServices, ICategory } from "@/api/category";

type DialogMode = "create" | "edit" | null;

const COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-orange-400 to-rose-500",
];

const AllCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading, setData } = useFetchData(() => categoryServices.getAll());
  const categories: ICategory[] = response?.data ?? [];

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products ?? 0), 0);

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [categories, searchQuery]
  );

  const openCreate = () => {
    setNameInput("");
    setSelectedCategory(null);
    setDialogMode("create");
  };

  const openEdit = (category: ICategory) => {
    setNameInput(category.name);
    setSelectedCategory(category);
    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCategory(null);
    setNameInput("");
  };

  const handleSave = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);

      if (dialogMode === "create") {
        const res = await categoryServices.create({ name: trimmed });
        if (res.success) {
          setData((prev) => (prev ? { ...prev, data: [res.data, ...prev.data] } : prev));
          toast({ title: "Category created successfully" });
        }
      } else if (dialogMode === "edit" && selectedCategory) {
        const res = await categoryServices.update(selectedCategory.id, { name: trimmed });
        if (res.success) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  data: prev.data.map((c) =>
                    c.id === selectedCategory.id ? { ...c, name: trimmed } : c
                  ),
                }
              : prev
          );
          toast({ title: "Category updated successfully" });
        }
      }

      closeDialog();
    } catch (error: any) {
      toast({
        title: dialogMode === "create" ? "Failed to create" : "Failed to update",
        description: error.message ?? "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await categoryServices.delete(deleteTargetId);
      if (res.success) {
        setData((prev) =>
          prev ? { ...prev, data: prev.data.filter((c) => c.id !== deleteTargetId) } : prev
        );
        toast({ title: "Category deleted successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message ?? "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <Loading text="Loading categories..." />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Tag className="w-7 h-7 text-primary" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize products by category for easy management
          </p>
        </div>
        <Button onClick={openCreate} className="gradient-coral hover:opacity-90 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Tag}
          label="Total Categories"
          value={categories.length}
          color="bg-primary/10 text-primary"
          delay="0s"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts}
          color="bg-success/10 text-success"
          delay="0.1s"
        />
        <StatCard
          icon={LayoutGrid}
          label="Avg Products/Category"
          value={categories.length ? (totalProducts / categories.length).toFixed(1) : 0}
          color="bg-info/10 text-info"
          delay="0.2s"
        />
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState onAdd={openCreate} hasSearch={!!searchQuery} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              onEdit={openEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              {dialogMode === "create" ? "New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Electronics, Furniture..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !nameInput.trim()}
              className="gradient-coral"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {dialogMode === "create" ? "Create" : "Save Changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

const CategoryCard = ({
  category,
  index,
  onEdit,
  onDelete,
}: {
  category: ICategory;
  index: number;
  onEdit: (c: ICategory) => void;
  onDelete: (id: string) => void;
}) => {
  const gradient = COLORS[index % COLORS.length];
  const productCount = category._count?.products ?? 0;

  return (
    <div
      className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-up group"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
          >
            <Tag className="w-6 h-6 text-white" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(category.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-foreground text-base mb-1 truncate">{category.name}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Created{" "}
          {new Date(category.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">{productCount}</span>
            <span className="text-xs">products</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-primary"
              onClick={() => onEdit(category)}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-destructive"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  delay: string;
}) => (
  <div
    className="bg-card rounded-xl p-5 border shadow-sm flex items-center gap-4 animate-fade-up opacity-0"
    style={{ animationDelay: delay, animationFillMode: "forwards" }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const EmptyState = ({ onAdd, hasSearch }: { onAdd: () => void; hasSearch: boolean }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
      <Tag className="w-10 h-10 text-muted-foreground/40" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">
      {hasSearch ? "No categories found" : "No categories yet"}
    </h3>
    <p className="text-muted-foreground text-sm mb-6 max-w-xs">
      {hasSearch
        ? "Try adjusting your search term"
        : "Get started by creating your first product category"}
    </p>
    {!hasSearch && (
      <Button onClick={onAdd} className="gradient-coral">
        <Plus className="w-4 h-4 mr-2" /> Create Category
      </Button>
    )}
  </div>
);

export default AllCategories;
