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

export interface MenuInfo {
  id?: number;
  type?: number;
  trans?: string;
  parentId?: number;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  sort?: number;
  disabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
  title?: string;
  icon?: string;
  hideMenu?: boolean;
  hideBreadcrumb?: boolean;
  ignoreKeepAlive?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  affix?: boolean;
  dynamicLevel?: number;
  realPath?: string;
  serviceName?: string;
  permission?: string;
}

export type RoleMenuResp = BaseListResponse<RouteRecordStringComponent>;

export type MenuPlainListResp = BaseListResponse<MenuInfo>;
