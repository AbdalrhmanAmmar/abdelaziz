import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  LogOut,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Search,
  X,
  Send,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Tag,
  Loader2,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { productServices } from "@/api/product";
import { categoryServices } from "@/api/category";
import { orderServices } from "@/api/order";
import { BRANCH_SESSION_KEY } from "./BranchLogin";
import type { IProduct } from "@/shared";
import type { ICategory } from "@/shared";
import type { IOrder, ICartItem } from "@/shared";

interface BranchSession {
  id: string;
  name: string;
  slug: string;
}

const COLORS = [
  "from-orange-400 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
];

const STATUS_CONFIG = {
  pending:  { label: "Pending",  icon: Clock,         color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle2,  color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  modified: { label: "Modified", icon: AlertCircle,   color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  rejected: { label: "Rejected", icon: XCircle,       color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const BranchDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<BranchSession | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState("order");

  // Validate session
  useEffect(() => {
    const stored = localStorage.getItem(BRANCH_SESSION_KEY);
    if (!stored) { navigate(`/branch/${slug}`, { replace: true }); return; }
    try {
      const parsed: BranchSession = JSON.parse(stored);
      if (parsed.slug !== slug) { navigate(`/branch/${slug}`, { replace: true }); return; }
      setSession(parsed);
    } catch {
      localStorage.removeItem(BRANCH_SESSION_KEY);
      navigate(`/branch/${slug}`, { replace: true });
    }
  }, [slug, navigate]);

  // Load products + categories once session is ready
  useEffect(() => {
    if (!session) return;
    setIsLoadingProducts(true);
    Promise.all([productServices.getAll(), categoryServices.getAll()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data);
      })
      .catch(() => toast({ title: "Failed to load products", variant: "destructive" }))
      .finally(() => setIsLoadingProducts(false));
  }, [session]);

  // Load orders when tab switches to "orders"
  useEffect(() => {
    if (activeTab !== "orders" || !session) return;
    setIsLoadingOrders(true);
    orderServices
      .getByBranch(session.id)
      .then((res) => setOrders(res.data))
      .catch(() => toast({ title: "Failed to load orders", variant: "destructive" }))
      .finally(() => setIsLoadingOrders(false));
  }, [activeTab, session]);

  // Filtered products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === "all" || p.categoryId === activeCat;
      return matchesSearch && matchesCat;
    });
  }, [products, search, activeCat]);

  // Cart helpers
  const cartQty = (productId: string) => cart.find((c) => c.productId === productId)?.quantity ?? 0;
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  const addToCart = (product: IProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          availableStock: product.quantity,
          categoryName: product.category?.name,
        },
      ];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.productId !== productId) return c;
          const next = c.quantity + delta;
          if (next < 1) return c;
          if (next > c.availableStock) return c;
          return { ...c, quantity: next };
        })
    );
  };

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((c) => c.productId !== productId));

  const clearCart = () => {
    setCart([]);
    setNotes("");
  };

  const submitOrder = async () => {
    if (!session || cart.length === 0) return;
    try {
      setIsSubmitting(true);
      await orderServices.create({
        branchId: session.id,
        branchName: session.name,
        notes: notes.trim() || undefined,
        items: cart.map((c) => ({
          productId: c.productId,
          productName: c.productName,
          quantity: c.quantity,
        })),
      });
      toast({ title: "Order submitted!", description: "The admin will review your order shortly." });
      clearCart();
      setIsCartOpen(false);
    } catch (error: any) {
      toast({ title: "Failed to submit order", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(BRANCH_SESSION_KEY);
    navigate(`/branch/${slug}`, { replace: true });
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-coral flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] text-muted-foreground leading-none mb-0.5">Al Abdulghani Motors</p>
              <p className="font-semibold text-foreground leading-none">{session.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell target={session.id} />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 hidden sm:flex">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="sm:hidden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="order" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                New Order
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <FileText className="w-4 h-4" />
                My Orders
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─ New Order Tab ─ */}
          <TabsContent value="order" className="mt-0">
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap mb-5">
              <button
                onClick={() => setActiveCat("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCat === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCat === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product, index) => {
                  const qty = cartQty(product.id);
                  const gradient = COLORS[index % COLORS.length];
                  const outOfStock = product.quantity === 0;

                  return (
                    <div
                      key={product.id}
                      className={`bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                        outOfStock ? "opacity-60" : ""
                      }`}
                    >
                      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
                          >
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          {product.category && (
                            <Badge variant="outline" className="text-[10px]">
                              <Tag className="w-2.5 h-2.5 mr-1" />
                              {product.category.name}
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>Stock: {product.quantity} units</span>
                          {outOfStock && (
                            <span className="text-destructive font-medium">Out of stock</span>
                          )}
                        </div>

                        {/* Cart control */}
                        {qty === 0 ? (
                          <Button
                            size="sm"
                            className="w-full gradient-coral text-xs h-8"
                            disabled={outOfStock}
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            Add to Order
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                if (qty === 1) removeFromCart(product.id);
                                else updateQty(product.id, -1);
                              }}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-bold text-primary">{qty}</span>
                            <button
                              onClick={() => updateQty(product.id, 1)}
                              disabled={qty >= product.quantity}
                              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ─ My Orders Tab ─ */}
          <TabsContent value="orders" className="mt-0">
            {isLoadingOrders ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Your submitted orders will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={order.id}
                      className="bg-card rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-[11px] gap-1 ${cfg.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                dateStyle: "medium",
                              })}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-foreground mb-1">
                            {(order.items ?? []).length} item(s)
                          </p>

                          {order.notes && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-3 space-y-1.5">
                        {(order.items ?? []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs bg-muted/30 rounded-lg px-3 py-2"
                          >
                            <span className="text-foreground font-medium truncate flex-1">
                              {item.productName}
                            </span>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                              <span className="text-muted-foreground">
                                Requested: <strong>{item.quantity}</strong>
                              </span>
                              {item.approvedQuantity != null && (
                                <span
                                  className={
                                    item.approvedQuantity === item.quantity
                                      ? "text-emerald-600"
                                      : "text-blue-600"
                                  }
                                >
                                  Approved: <strong>{item.approvedQuantity}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Admin notes */}
                      {order.adminNotes && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <p className="text-[11px] text-muted-foreground font-medium mb-0.5">
                            Admin note
                          </p>
                          <p className="text-xs text-foreground">{order.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Cart Sheet ─────────────────────────────── */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Order Cart
              {cart.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {totalItems} items
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="text-sm">Your cart is empty</p>
              <Button variant="outline" size="sm" onClick={() => setIsCartOpen(false)}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        {item.categoryName && (
                          <p className="text-[10px] text-muted-foreground">{item.categoryName}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) removeFromCart(item.productId);
                            else updateQty(item.productId, -1);
                          }}
                          className="w-7 h-7 rounded-md border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3 h-3 text-destructive" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          disabled={item.quantity >= item.availableStock}
                          className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                  <Textarea
                    placeholder="Add any notes or special instructions for this order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="resize-none text-sm"
                  />
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-6 py-4 border-t space-y-3 bg-card">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total items</span>
                  <span className="font-bold text-foreground">{totalItems}</span>
                </div>
                <Button
                  className="w-full gradient-coral gap-2"
                  disabled={isSubmitting}
                  onClick={submitOrder}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Order
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={clearCart}
                  disabled={isSubmitting}
                >
                  Clear cart
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Floating Cart Button ────────────────────── */}
      {!isCartOpen && totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-coral shadow-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-primary text-[11px] font-bold flex items-center justify-center ring-2 ring-primary/20">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        </button>
      )}
    </div>
  );
};

export default BranchDashboard;
