import type { FormPermissionModel, FormPermissionValidations, PermissionRequest } from "..";

export interface RoleRequest {
  name: string;
  permissions: PermissionRequest[];
}

export interface FormRoleModel {
  name: string;
  permissions: FormPermissionModel[];
}

export interface FormRoleValidations {
  name: [(value: string) => boolean, string];
  permissions: [(value: FormPermissionValidations[]) => boolean, string];
}