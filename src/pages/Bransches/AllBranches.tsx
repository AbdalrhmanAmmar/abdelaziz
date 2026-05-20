import { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  MoreVertical,
  Copy,
  Eye,
  EyeOff,
  Link,
  Lock,
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
import { branchServices } from "@/api/branch";
import { IBranch } from "@/shared";

type DialogMode = "create" | "edit" | null;

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const AllBranches = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading, setData } = useFetchData(() => branchServices.getAll());
  const branches: IBranch[] = response?.data ?? [];

  const slug = toSlug(nameInput);

  const filtered = useMemo(
    () => branches.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [branches, searchQuery]
  );

  const openCreate = () => {
    setNameInput("");
    setPasswordInput("");
    setSelectedBranch(null);
    setShowPassword(false);
    setDialogMode("create");
  };

  const openEdit = (branch: IBranch) => {
    setNameInput(branch.name);
    setPasswordInput(branch.password);
    setSelectedBranch(branch);
    setShowPassword(false);
    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedBranch(null);
    setNameInput("");
    setPasswordInput("");
    setShowPassword(false);
  };

  const handleSave = async () => {
    const trimmedName = nameInput.trim();
    const trimmedPassword = passwordInput.trim();
    if (!trimmedName || !trimmedPassword) return;

    try {
      setIsSaving(true);
      const payload = { name: trimmedName, password: trimmedPassword, slug: toSlug(trimmedName) };

      if (dialogMode === "create") {
        const res = await branchServices.create(payload);
        if (res.success) {
          setData((prev) => (prev ? { ...prev, data: [res.data, ...prev.data] } : prev));
          toast({ title: "Branch created successfully" });
        }
      } else if (dialogMode === "edit" && selectedBranch) {
        const res = await branchServices.update(selectedBranch.id, payload);
        if (res.success) {
          setData((prev) =>
            prev
              ? { ...prev, data: prev.data.map((b) => (b.id === selectedBranch.id ? res.data : b)) }
              : prev
          );
          toast({ title: "Branch updated successfully" });
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
      const res = await branchServices.delete(deleteTargetId);
      if (res.success) {
        setData((prev) =>
          prev ? { ...prev, data: prev.data.filter((b) => b.id !== deleteTargetId) } : prev
        );
        toast({ title: "Branch deleted successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message ?? "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const copyLink = (branchSlug: string) => {
    const url = `${window.location.origin}/branch/${branchSlug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Login link copied to clipboard" });
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <Loading text="Loading branches..." />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            Branches
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage branches and their dedicated login pages
          </p>
        </div>
        <Button onClick={openCreate} className="gradient-coral hover:opacity-90 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          New Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border shadow-sm flex items-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "forwards" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{branches.length}</p>
            <p className="text-xs text-muted-foreground">Total Branches</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border shadow-sm flex items-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/10 text-success">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{branches.length}</p>
            <p className="text-xs text-muted-foreground">Active Login Pages</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Building2 className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {searchQuery ? "No branches found" : "No branches yet"}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first branch to get a dedicated login page"}
          </p>
          {!searchQuery && (
            <Button onClick={openCreate} className="gradient-coral">
              <Plus className="w-4 h-4 mr-2" /> Create Branch
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((branch, index) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              index={index}
              onEdit={openEdit}
              onDelete={handleDeleteClick}
              onCopyLink={copyLink}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {dialogMode === "create" ? "New Branch" : "Edit Branch"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                placeholder="e.g. Main Branch, North Branch..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="branch-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Set a password for this branch"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {nameInput.trim() && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Login URL Preview</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg border text-sm font-mono text-muted-foreground overflow-hidden">
                  <Link className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                  <span className="truncate">/branch/{slug}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !nameInput.trim() || !passwordInput.trim()}
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

/* ─── Branch Card ─────────────────────────────────────────────── */

const BranchCard = ({
  branch,
  index,
  onEdit,
  onDelete,
  onCopyLink,
}: {
  branch: IBranch;
  index: number;
  onEdit: (b: IBranch) => void;
  onDelete: (id: string) => void;
  onCopyLink: (slug: string) => void;
}) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-up group"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
    >
      <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
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
              <DropdownMenuItem onClick={() => onEdit(branch)}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(branch.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-foreground text-base mb-1">{branch.name}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Created {new Date(branch.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
        </p>

        {/* Password row */}
        <div className="flex items-center gap-2 mb-3 p-2.5 bg-muted/30 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-mono text-muted-foreground flex-1 truncate">
            {showPass ? branch.password : "••••••••"}
          </span>
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Login URL */}
        <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-lg border">
          <Link className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs font-mono text-muted-foreground truncate flex-1">
            /branch/{branch.slug}
          </span>
          <button
            type="button"
            onClick={() => onCopyLink(branch.slug)}
            className="text-muted-foreground hover:text-primary flex-shrink-0 transition-colors"
            title="Copy login link"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllBranches;
