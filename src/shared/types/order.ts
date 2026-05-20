export type OrderStatus = "pending" | "approved" | "modified" | "rejected";

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  categoryName?: string | null;
  quantity: number;
  approvedQuantity?: number | null;
  createdAt: string | Date;
}

export interface IOrder {
  id: string;
  branchId: string;
  branchName: string;
  status: OrderStatus;
  notes?: string | null;
  adminNotes?: string | null;
  items?: IOrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateOrderItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface ICreateOrder {
  branchId: string;
  branchName: string;
  notes?: string;
  items: ICreateOrderItem[];
}

export interface ICartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  availableStock: number;
  categoryName?: string;
}

export interface INotification {
  id: string;
  target: string;
  message: string;
  orderId?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}
