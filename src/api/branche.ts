// services/branch.service.ts
import { IBranch, ICreateBranchInput } from "@/interface/branches";
import { BaseService } from "./base.service";

// هنا نقوم بتمرير:
// 1. النوع الأساسي (IBranch)
// 2. نوع بيانات الإنشاء (ICreateBranchInput)
// 3. نوع بيانات التعديل (Partial من بيانات الإنشاء)
// 4. المسار الأساسي ("/branches")

class BranchServiceClass extends BaseService<
  IBranch,
  ICreateBranchInput,
  Partial<ICreateBranchInput>
> {
  constructor() {
    super("/branches");
  }

  // هنا تقدر تضيف أي ميثود خاصة بالفروع فقط مستقبلاً
  // مثلاً: getActiveBranches
}

export const BranchService = new BranchServiceClass();
