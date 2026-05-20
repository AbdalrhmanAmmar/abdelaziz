export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  warehouseId: string;
  createdAt: string | Date;
  category?: { id: string; name: string };
  warehouse?: { id: string; name: string };
}

export interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  warehouseId: string;
}

export interface IUpdateProduct {
  name?: string;
  price?: number;
  quantity?: number;
  categoryId?: string;
  warehouseId?: string;
}
