export interface BaseListRequest {
  cursor: number;
  pageSize: number;
}

export interface BaseListResponse<T> {
  list?: T[];
  total?: number;
  cursor?: number;
}
export interface BaseResponse {
  code?: number;
  message: string;
}

// export interface BaseDataResp<T> {
//   data: T[];
// }

// export interface BaseListResp<T> {
//   data: T[];
//   total: number;
// }
