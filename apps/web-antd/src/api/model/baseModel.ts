export interface BaseDataResp<T> {
  // data: T;
  data: T[];
}

export interface BaseListResp<T> {
  data: T[];
  total: number;
}
