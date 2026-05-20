export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  meta: IPaginationMeta;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
}
