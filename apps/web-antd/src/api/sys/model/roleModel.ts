import type { BaseListResponse } from '../../model/baseModel';

export interface RoleInfo {
  id?: number;
  createdAt?: number;
  status?: number;
  name?: string;
  defaultRouter?: string;
  remark?: string;
  sort?: number;
  code?: string;
}

interface RoleListResult {
  list: RoleInfo[];
  total: number;
  cursor: number;
}

export type RoleListResp = BaseListResponse<RoleListResult>;
