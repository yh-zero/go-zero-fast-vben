import { type BaseResultResponse } from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import { type RoleMenuResp } from './model/menuModel';
import type { RouteRecordStringComponent } from '@vben/typings';

enum Api {
  GetMenuListByRole = '/v1/sys/menu/role/list',
}

/**
 * @description: Get user menu list by role id
 */
export const getMenuListByRole = () => {
  // return requestClient.get<BaseDataResp<RoleMenuResp>>(Api.GetMenuListByRole);
  return requestClient.get<BaseResultResponse<RouteRecordStringComponent>>(
    Api.GetMenuListByRole,
  );
};
