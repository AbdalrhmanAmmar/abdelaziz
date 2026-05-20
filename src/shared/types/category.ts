export interface ICategory {
  id: string;
  name: string;
  createdAt: string | Date;
  productCount?: number;
}

export interface ICreateCategory {
  name: string;
}

export interface IUpdateCategory {
  name?: string;
}
