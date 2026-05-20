export interface IBranch {
  id: string;
  name: string;
  password: string;
  slug: string;
  createdAt: string | Date;
}

export interface ICreateBranch {
  name: string;
  password: string;
  slug: string;
}

export interface IUpdateBranch {
  name?: string;
  password?: string;
  slug?: string;
}

export interface IBranchSession {
  id: string;
  name: string;
  slug: string;
}
