import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  Plus,
  Search,
  User,
  ShoppingCart,
  Star,
  Flame,
  Target,
  Zap,
  ArrowLeft,
  Package,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  badge: "popular" | "recommended" | "trending";
  score: number;
  reason: string;
  purchasedBy: number;
}

interface Customer {
  id: number;
  name: string;
  totalPurchases: number;
  lastPurchase: string;
  avatar: string;
}

const customers: Customer[] = [
  { id: 1, name: "أحمد محمد", totalPurchases: 15, lastPurchase: "2024-01-10", avatar: "أ" },
  { id: 2, name: "سارة علي", totalPurchases: 23, lastPurchase: "2024-01-12", avatar: "س" },
  { id: 3, name: "محمود حسن", totalPurchases: 8, lastPurchase: "2024-01-08", avatar: "م" },
  { id: 4, name: "فاطمة أحمد", totalPurchases: 31, lastPurchase: "2024-01-14", avatar: "ف" },
];

const recommendedProducts: RecommendedProduct[] = [
  {
    id: 1,
    name: "لابتوب Dell XPS 15",
    price: 4500,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200",
    badge: "popular",
    score: 95,
    reason: "85% من العملاء المشابهين اشتروا هذا المنتج",
    purchasedBy: 127,
  },
  {
    id: 2,
    name: "ماوس لاسلكي Logitech",
    price: 150,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
    badge: "recommended",
    score: 88,
    reason: "يُشترى عادةً مع المنتجات السابقة للعميل",
    purchasedBy: 89,
  },
  {
    id: 3,
    name: "سماعات Sony WH-1000XM5",
    price: 1200,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    badge: "trending",
    score: 82,
    reason: "منتج رائج هذا الأسبوع",
    purchasedBy: 203,
  },
  {
    id: 4,
    name: "شاحن سريع 65W",
    price: 180,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200",
    badge: "recommended",
    score: 75,
    reason: "مكمل للمشتريات السابقة",
    purchasedBy: 56,
  },
  {
    id: 5,
    name: "حقيبة لابتوب جلد",
    price: 350,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
    badge: "popular",
    score: 70,
    reason: "اختيار شائع لعملاء مشابهين",
    purchasedBy: 145,
  },
  {
    id: 6,
    name: "كيبورد ميكانيكي RGB",
    price: 450,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200",
    badge: "trending",
    score: 65,
    reason: "ارتفاع في الطلب مؤخراً",
    purchasedBy: 78,
  },
];

const SalesBoost = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<number[]>([]);

  const getBadgeConfig = (badge: string) => {
    switch (badge) {
      case "popular":
        return {
          icon: Flame,
          label: "الأكثر شيوعًا",
          className: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
        };
      case "recommended":
        return {
          icon: Star,
          label: "مقترح",
          className: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
        };
      case "trending":
        return {
          icon: TrendingUp,
          label: "رائج",
          className: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
        };
      default:
        return {
          icon: Star,
          label: "مقترح",
          className: "bg-primary/20 text-primary border-primary/30",
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const addToCart = (productId: number, productName: string) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
      toast({
        title: "تمت الإضافة",
        description: `تم إضافة ${productName} إلى الفاتورة`,
      });
    }
  };

  const isInCart = (productId: number) => cartItems.includes(productId);

  const filteredProducts = recommendedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-coral/20 to-rose/20">
                  <Zap className="h-6 w-6 text-coral" />
                </div>
                <h1 className="text-2xl font-bold text-navy dark:text-foreground">
                  زيادة المبيعات
                </h1>
              </div>
              <p className="text-muted-foreground mt-1 mr-12">
                اقتراحات ذكية لتعزيز مبيعاتك بناءً على سلوك العملاء
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <Button className="bg-coral hover:bg-coral/90 text-white gap-2">
              <ShoppingCart className="h-4 w-4" />
              إنشاء فاتورة ({cartItems.length})
            </Button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "معدل التحويل", value: "23%", icon: Target, color: "text-coral" },
            {
              label: "مبيعات إضافية",
              value: "12,450 ر.س",
              icon: DollarSign,
              color: "text-green-500",
            },
            { label: "عملاء مستهدفين", value: "156", icon: Users, color: "text-blue-500" },
            { label: "منتجات مقترحة", value: "24", icon: Package, color: "text-purple-500" },
          ].map((stat, index) => (
            <Card key={index} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Selection */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-coral" />
                اختر العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                onValueChange={(value) =>
                  setSelectedCustomer(customers.find((c) => c.id === parseInt(value)) || null)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر عميل لعرض التوصيات" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center text-coral font-bold text-sm">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.totalPurchases} عملية شراء
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCustomer && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-coral/5 to-rose/5 border border-coral/20 space-y-3 animate-fade-up">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center text-coral font-bold text-lg">
                      {selectedCustomer.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">عميل منتظم</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">إجمالي المشتريات</p>
                      <p className="font-bold text-coral">{selectedCustomer.totalPurchases}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">آخر شراء</p>
                      <p className="font-bold">{selectedCustomer.lastPurchase}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-2 rounded-xl bg-gradient-to-br from-coral/20 to-yellow-500/20 cursor-help">
                          <Sparkles className="h-5 w-5 text-coral" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>مقترحات بناءً على مشتريات عملاء مشابهين وسلوك الشراء السابق</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <CardTitle className="text-lg">منتجات مقترحة لهذا العميل</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      توصيات ذكية بناءً على التحليل
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9 w-40 h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pl-2">
                {filteredProducts.map((product, index) => {
                  const badgeConfig = getBadgeConfig(product.badge);
                  const BadgeIcon = badgeConfig.icon;
                  const inCart = isInCart(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group p-4 rounded-xl border border-border/50 hover:border-coral/30 hover:shadow-lg transition-all duration-300 bg-card animate-fade-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <Badge
                            variant="outline"
                            className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 ${badgeConfig.className}`}
                          >
                            <BadgeIcon className="h-3 w-3 ml-1" />
                            {badgeConfig.label}
                          </Badge>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-coral font-bold mt-1">{product.price} ر.س</p>

                          {/* Score */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">قوة التوصية</span>
                              <span className="font-medium">{product.score}%</span>
                            </div>
                            <Progress value={product.score} className="h-1.5" />
                          </div>

                          {/* Reason */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground mt-2 truncate cursor-help flex items-center gap-1">
                                  <Lightbulb className="h-3 w-3" />
                                  {product.reason}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{product.reason}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  اشتراه {product.purchasedBy} عميل
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        className={`w-full mt-3 gap-2 transition-all ${
                          inCart
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-coral hover:bg-coral/90 text-white"
                        }`}
                        onClick={() => addToCart(product.id, product.name)}
                        disabled={inCart}
                      >
                        {inCart ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            تمت الإضافة
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            أضف إلى الفاتورة
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground mt-2">لا توجد منتجات مطابقة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-coral" />
              رؤى وتحليلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "أفضل وقت للبيع",
                  value: "الأحد - الثلاثاء",
                  description: "العملاء أكثر نشاطاً في بداية الأسبوع",
                  icon: TrendingUp,
                },
                {
                  title: "متوسط قيمة السلة",
                  value: "850 ر.س",
                  description: "يمكن زيادتها بـ 15% مع التوصيات",
                  icon: ShoppingCart,
                },
                {
                  title: "معدل قبول التوصيات",
                  value: "34%",
                  description: "أعلى من المتوسط بـ 8%",
                  icon: Target,
                },
              ].map((insight, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-coral/10">
                      <insight.icon className="h-4 w-4 text-coral" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{insight.title}</p>
                      <p className="font-bold text-lg mt-0.5">{insight.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesBoost;
