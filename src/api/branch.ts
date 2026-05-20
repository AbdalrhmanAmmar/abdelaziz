import { supabase } from "@/lib/supabase";
import { SupabaseBaseService } from "./supabase.base";
import { IBranch, ICreateBranch, IUpdateBranch, IBranchSession } from "@/shared";

class BranchService extends SupabaseBaseService<IBranch, ICreateBranch, IUpdateBranch> {
  constructor() {
    super("branch");
  }

  async verifyLogin(slug: string, password: string): Promise<IBranchSession | null> {
    const { data, error } = await supabase.rpc("verify_branch_login", {
      p_slug: slug,
      p_password: password,
    });

    if (error || !data || data.length === 0) return null;
    const b = data[0];
    return { id: b.id, name: b.name, slug: b.slug };
  }
}

export const branchServices = new BranchService();
