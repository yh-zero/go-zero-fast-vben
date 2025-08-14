import {
  type BaseListRequest,
  type BaseListResponse,
} from '#/api/model/baseModel';
import { requestClient } from '#/api/request';
import { type RoleListResp } from './model/roleModel';

enum Api {
  GetRoleList = '/v1/sys/role/list',
}

export const getRoleList = (params: BaseListRequest) => {
  return requestClient.get<BaseListResponse<RoleListResp>>(Api.GetRoleList, {
    params,
  });
};
