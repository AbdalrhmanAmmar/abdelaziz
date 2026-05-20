import { useState, useMemo } from "react";
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { userServices } from "@/api/user";
import { useFetchData } from "@/hooks/useFetchData";
import { Loading } from "@/components/shared/Loading";
import { ConfirmDelete } from "@/components/shared/ConfirmDelete";
import { toast } from "@/hooks/use-toast";

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading, setData } = useFetchData(() => userServices.getAll());
  const users = response?.data ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleDelete = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedUserId(id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      setIsDeleting(true);
      const res = await userServices.delete(selectedUserId);
      if (res.success) {
        setData((prev) => prev ? { ...prev, data: prev.data.filter((u) => u.id !== selectedUserId) } : null);
        toast({ title: "تم الحذف بنجاح" });
      }
    } catch (error: any) {
      toast({
        title: "فشل الحذف",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <Loading text="جاري تحميل المستخدمين..." />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-1">عرض وإدارة جميع المستخدمين في النظام</p>
        </div>
        <Button onClick={() => navigate("add")} className="gradient-coral hover:opacity-90">
          <Plus className="w-5 h-5 ml-2" /> إضافة مستخدم
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 shadow-sm border animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-success/10 text-success">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{filteredUsers.length}</p>
              <p className="text-xs text-muted-foreground">نتائج البحث</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="البحث باسم المستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-center w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  لا يوجد مستخدمين مطابقين للبحث
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors animate-fade-up"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarFallback className="gradient-coral text-white font-medium">
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-foreground">@{user.username}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`edit/${user.id}`)}>
                          <Edit className="w-4 h-4 ml-2" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border text-center sm:text-right">
          <p className="text-sm text-muted-foreground">
            عرض {filteredUsers.length} من إجمالي {users.length} مستخدم
          </p>
        </div>
      </div>

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
};

export default AllUsers;
