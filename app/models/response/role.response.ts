import type { MetaPagination, PermissionModel } from "..";


export interface RoleResponse extends MetaPagination {
  data: RoleModel[];
}

export interface RoleModel {
  id: string;
  name: string;
  permissions: PermissionModel[];
}