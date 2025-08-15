import type {
  BaseListRequest,
  BaseListResponse,
  BaseResponse,
} from '#/api/model/baseModel';
import type { RoleListResp, RoleInfo } from './model/roleModel';
import { requestClient } from '#/api/request';

enum Api {
  GetRoleList = '/v1/sys/role/list',
  UpdateRole = '/v1/sys/role/updateRole',
}

export const getRoleList = (params: BaseListRequest) => {
  return requestClient.get<BaseListResponse<RoleListResp>>(Api.GetRoleList, {
    params,
  });
};

export const updateRole = (params: RoleInfo) => {
  return requestClient.put<BaseResponse>(Api.UpdateRole, params);
};
