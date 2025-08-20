import type {
  BaseListRequest,
  BaseListResponse,
  BaseResponse,
  BaseIDsRequest,
} from '#/api/model/baseModel';
import type { RoleListResp, RoleInfo } from './model/roleModel';
import { requestClient } from '#/api/request';

enum Api {
  GetRoleList = '/v1/sys/role/list',
  UpdateRole = '/v1/sys/role/updateRole',
  DeleteRole = '/v1/sys/role/deleteRole',
  CreateRole = '/v1/sys/role/createRole',
}

// 获取角色列表
export const getRoleList = (params: BaseListRequest) => {
  return requestClient.get<BaseListResponse<RoleListResp>>(Api.GetRoleList, {
    params,
  });
};

// 更新角色
export const updateRole = (params: RoleInfo) => {
  return requestClient.put<BaseResponse>(Api.UpdateRole, params);
};

// 删除角色 - 支持一个 多个
export const deleteRole = (params: BaseIDsRequest) => {
  return requestClient.post<BaseResponse>(Api.DeleteRole, params);
};

export const createRole = (params: RoleInfo) => {
  return requestClient.post<BaseResponse>(Api.CreateRole, params);
};
