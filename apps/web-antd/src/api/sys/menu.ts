import { type BaseResultResponse } from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import { type MenuPlainListResp } from './model/menuModel';
import type { RouteRecordStringComponent } from '@vben/typings';
import type { BaseListResponse } from '#/api/model/baseModel';

enum Api {
  GetMenuListByRole = '/v1/sys/menu/role/list',
  GetMenuList = '/v1/sys/menu/list',
}

/**
 * @description: Get user menu list by role id
 */
export const getMenuListByRole = () => {
  return requestClient.get<BaseResultResponse<RouteRecordStringComponent>>(
    Api.GetMenuListByRole,
  );
};

// 获取菜单列表
export const getMenuList = () => {
  return requestClient.get<BaseListResponse<MenuPlainListResp>>(
    Api.GetMenuList,
  );
};
