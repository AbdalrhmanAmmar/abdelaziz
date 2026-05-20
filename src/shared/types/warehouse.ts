export interface IWarehouse {
  id: string;
  name: string;
  createdAt: string | Date;
  productCount?: number;
}

export interface ICreateWarehouse {
  name: string;
}

export interface IUpdateWarehouse {
  name?: string;
}
