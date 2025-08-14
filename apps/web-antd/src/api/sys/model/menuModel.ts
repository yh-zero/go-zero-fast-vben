import type { RouteRecordStringComponent } from '@vben/typings';
import type { BaseListResponse } from '../../model/baseModel';
import type { RouteMeta } from 'vue-router';

export interface RouteItem {
  id?: number;
  parentId?: number;
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
  permission?: string;
}

/**
 * @description: Get menu return value
 */
export type RoleMenuResp = BaseListResponse<RouteRecordStringComponent>;
