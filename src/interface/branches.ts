// types/branch.interface.ts

export interface IBranch {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  status?: string;
  sales?: string;
  employees?: string;
  performance?: string;
  manager?: string;

  createdAt?: string | Date;
}

export interface ICreateBranchInput extends Omit<IBranch, "id" | "createdAt"> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
