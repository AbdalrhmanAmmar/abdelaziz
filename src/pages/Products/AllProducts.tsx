import { useState, useMemo, useEffect } from "react";
import {
  Package,
  PackagePlus,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  MoreVertical,
  Tag,
  Warehouse,
  Boxes,
  History,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loading } from "@/components/shared/Loading";
import { ConfirmDelete } from "@/components/shared/ConfirmDelete";
import { useFetchData } from "@/hooks/useFetchData";
import { productServices, IProduct, ICreateProduct, IUpdateProduct, IProductOrderHistory } from "@/api/product";
import { categoryServices, ICategory } from "@/api/category";
import { warehouseServices, IWarehouse } from "@/api/warehouse";

type DialogMode = "create" | "edit" | null;

interface FormState {
  name: string;
  quantity: string;
  categoryId: string;
  warehouseId: string;
}

const emptyForm: FormState = { name: "", quantity: "", categoryId: "", warehouseId: "" };

const COLORS = [
  "from-orange-400 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
];

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  pending:  { label: "Pending",  icon: Clock,         className: "text-amber-600 bg-amber-50 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle2,  className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  modified: { label: "Modified", icon: AlertCircle,   className: "text-blue-600 bg-blue-50 border-blue-200" },
  rejected: { label: "Rejected", icon: XCircle,       className: "text-destructive bg-destructive/10 border-destructive/20" },
};

const Allproducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Order history state
  const [historyProduct, setHistoryProduct] = useState<IProduct | null>(null);
  const [historyData, setHistoryData] = useState<IProductOrderHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Add quantity state
  const [addQtyProduct, setAddQtyProduct] = useState<IProduct | null>(null);
  const [addQtyInput, setAddQtyInput] = useState("");
  const [isAddingQty, setIsAddingQty] = useState(false);

  const {
    data: productResponse,
    isLoading,
    setData,
  } = useFetchData(() => productServices.getAll());
  const { data: categoryResponse } = useFetchData(() => categoryServices.getAll());
  const { data: warehouseResponse } = useFetchData(() => warehouseServices.getAll());

  const products: IProduct[] = productResponse?.data ?? [];
  const categories: ICategory[] = categoryResponse?.data ?? [];
  const warehouses: IWarehouse[] = warehouseResponse?.data ?? [];

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Fetch order history when a product is selected
  useEffect(() => {
    if (!historyProduct) return;
    setIsHistoryLoading(true);
    setHistoryData([]);
    productServices
      .getOrderHistory(historyProduct.id)
      .then((rows) => setHistoryData(rows))
      .catch(() => toast({ title: "Failed to load order history", variant: "destructive" }))
      .finally(() => setIsHistoryLoading(false));
  }, [historyProduct]);

  const openCreate = () => {
    setForm(emptyForm);
    setSelectedProduct(null);
    setDialogMode("create");
  };

  const openEdit = (product: IProduct) => {
    setForm({
      name: product.name,
      quantity: String(product.quantity),
      categoryId: product.categoryId,
      warehouseId: product.warehouseId,
    });
    setSelectedProduct(product);
    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedProduct(null);
    setForm(emptyForm);
  };

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isFormValid =
    form.name.trim().length >= 2 &&
    Number(form.quantity) >= 0 &&
    form.categoryId !== "" &&
    form.warehouseId !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    const payload = {
      name: form.name.trim(),
      quantity: Number(form.quantity),
      categoryId: form.categoryId,
      warehouseId: form.warehouseId,
    };

    try {
      setIsSaving(true);

      if (dialogMode === "create") {
        const res = await productServices.create(payload as ICreateProduct);
        if (res.success) {
          setData((prev) => (prev ? { ...prev, data: [res.data, ...prev.data] } : prev));
          toast({ title: "Product created successfully" });
        }
      } else if (dialogMode === "edit" && selectedProduct) {
        const res = await productServices.update(selectedProduct.id, payload as IUpdateProduct);
        if (res.success) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  data: prev.data.map((p) =>
                    p.id === selectedProduct.id ? { ...p, ...res.data } : p
                  ),
                }
              : prev
          );
          toast({ title: "Product updated successfully" });
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

  const handleAddQuantity = async () => {
    if (!addQtyProduct) return;
    const amount = parseInt(addQtyInput, 10);
    if (!amount || amount <= 0) return;

    try {
      setIsAddingQty(true);
      const newQty = addQtyProduct.quantity + amount;
      const res = await productServices.update(addQtyProduct.id, { quantity: newQty } as IUpdateProduct);
      if (res.success) {
        setData((prev) =>
          prev
            ? { ...prev, data: prev.data.map((p) => (p.id === addQtyProduct.id ? { ...p, quantity: newQty } : p)) }
            : prev
        );
        toast({ title: `Added ${amount} units to "${addQtyProduct.name}"` });
        setAddQtyProduct(null);
        setAddQtyInput("");
      }
    } catch (error: any) {
      toast({ title: "Failed to update quantity", description: error.message ?? "Unexpected error", variant: "destructive" });
    } finally {
      setIsAddingQty(false);
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
      const res = await productServices.delete(deleteTargetId);
      if (res.success) {
        setData((prev) =>
          prev ? { ...prev, data: prev.data.filter((p) => p.id !== deleteTargetId) } : prev
        );
        toast({ title: "Product deleted successfully" });
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
        <Loading text="Loading products..." />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Products
          </h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog and inventory</p>
        </div>
        <Button onClick={openCreate} className="gradient-coral hover:opacity-90 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          color="bg-primary/10 text-primary"
          delay="0s"
        />
        <StatCard
          icon={Boxes}
          label="Total Stock"
          value={totalStock}
          color="bg-info/10 text-info"
          delay="0.1s"
        />
        <StatCard
          icon={Tag}
          label="Categories"
          value={categories.length}
          color="bg-success/10 text-success"
          delay="0.2s"
        />
      </div>

      {/* Search + Filter */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState onAdd={openCreate} hasSearch={!!searchQuery || categoryFilter !== "all"} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onEdit={openEdit}
              onDelete={handleDeleteClick}
              onViewHistory={setHistoryProduct}
              onAddQuantity={setAddQtyProduct}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {dialogMode === "create" ? "New Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Product Name</Label>
              <Input
                id="prod-name"
                placeholder="e.g. Wireless Mouse"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-qty">Quantity</Label>
                <Input
                  id="prod-qty"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setField("quantity", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setField("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Select value={form.warehouseId} onValueChange={(v) => setField("warehouseId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !isFormValid}
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

      {/* Order History Dialog */}
      <Dialog open={!!historyProduct} onOpenChange={() => setHistoryProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Order History — {historyProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {isHistoryLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : historyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <History className="w-10 h-10 opacity-20" />
              <p className="text-sm">No orders have been placed for this product yet</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs">
                    <th className="text-left py-2 px-3 font-medium">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Branch</span>
                    </th>
                    <th className="text-center py-2 px-3 font-medium">Requested</th>
                    <th className="text-center py-2 px-3 font-medium">Approved</th>
                    <th className="text-center py-2 px-3 font-medium">Status</th>
                    <th className="text-right py-2 px-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row) => {
                    const cfg = STATUS_CONFIG[row.order?.status ?? ""] ?? STATUS_CONFIG.pending;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {row.order?.branchName ?? "—"}
                        </td>
                        <td className="py-2.5 px-3 text-center">{row.quantity}</td>
                        <td className="py-2.5 px-3 text-center">
                          {row.approvedQuantity != null ? (
                            <span className={row.approvedQuantity !== row.quantity ? "text-amber-600 font-semibold" : ""}>
                              {row.approvedQuantity}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(row.createdAt as string), { addSuffix: true })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryProduct(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Quantity Dialog */}
      <Dialog
        open={!!addQtyProduct}
        onOpenChange={() => { setAddQtyProduct(null); setAddQtyInput(""); }}
      >
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-primary" />
              Add Stock
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Product:{" "}
              <span className="font-medium text-foreground">{addQtyProduct?.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Current stock:{" "}
              <span className="font-medium text-foreground">{addQtyProduct?.quantity} units</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="add-qty">Quantity to Add</Label>
              <Input
                id="add-qty"
                type="number"
                min={1}
                step="1"
                placeholder="e.g. 50"
                value={addQtyInput}
                onChange={(e) => setAddQtyInput(e.target.value)}
                autoFocus
              />
            </div>
            {addQtyInput && parseInt(addQtyInput) > 0 && (
              <p className="text-xs text-muted-foreground">
                New stock:{" "}
                <span className="font-semibold text-foreground">
                  {(addQtyProduct?.quantity ?? 0) + parseInt(addQtyInput)} units
                </span>
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => { setAddQtyProduct(null); setAddQtyInput(""); }}
              disabled={isAddingQty}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={handleAddQuantity}
              disabled={isAddingQty || !addQtyInput || parseInt(addQtyInput) <= 0}
              className="gradient-coral"
            >
              {isAddingQty ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
              ) : (
                <><Check className="w-4 h-4 mr-1" /> Add Stock</>
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

const ProductCard = ({
  product,
  index,
  onEdit,
  onDelete,
  onViewHistory,
  onAddQuantity,
}: {
  product: IProduct;
  index: number;
  onEdit: (p: IProduct) => void;
  onDelete: (id: string) => void;
  onViewHistory: (p: IProduct) => void;
  onAddQuantity: (p: IProduct) => void;
}) => {
  const gradient = COLORS[index % COLORS.length];

  return (
    <div
      className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-up group"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
          >
            <Package className="w-6 h-6 text-white" />
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
              <DropdownMenuItem onClick={() => onViewHistory(product)}>
                <History className="w-4 h-4 mr-2" /> Order History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddQuantity(product)}>
                <PackagePlus className="w-4 h-4 mr-2" /> Add Stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-foreground text-base mb-1 truncate">{product.name}</h3>

        {product.category && (
          <Badge variant="outline" className="mb-3 text-xs">
            {product.category.name}
          </Badge>
        )}

        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Boxes className="w-3.5 h-3.5" /> Stock
            </span>
            <span
              className={`font-medium ${
                product.quantity === 0
                  ? "text-destructive"
                  : product.quantity < 10
                    ? "text-warning"
                    : "text-foreground"
              }`}
            >
              {product.quantity} units
            </span>
          </div>
          {product.warehouse && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5" /> Warehouse
              </span>
              <span className="text-foreground text-xs truncate max-w-[100px]">
                {product.warehouse.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-1 pt-3 border-t border-border/50 justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary px-2"
            onClick={() => onViewHistory(product)}
          >
            <History className="w-3.5 h-3.5" /> History
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-emerald-600"
              title="Add Stock"
              onClick={() => onAddQuantity(product)}
            >
              <PackagePlus className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-primary"
              onClick={() => onEdit(product)}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-destructive"
              onClick={() => onDelete(product.id)}
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
      <Package className="w-10 h-10 text-muted-foreground/40" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">
      {hasSearch ? "No products found" : "No products yet"}
    </h3>
    <p className="text-muted-foreground text-sm mb-6 max-w-xs">
      {hasSearch
        ? "Try adjusting your search or filter"
        : "Get started by adding your first product"}
    </p>
    {!hasSearch && (
      <Button onClick={onAdd} className="gradient-coral">
        <Plus className="w-4 h-4 mr-2" /> Add Product
      </Button>
    )}
  </div>
);

export default Allproducts;
