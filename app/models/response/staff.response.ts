import type { MetaPagination, RoleModel, UserModel } from "..";

export interface StaffResponse extends MetaPagination {
  data: UserModel[];
}

export interface StaffModel{
  role: RoleModel;
}
