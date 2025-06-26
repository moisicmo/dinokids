import type { MetaPagination, RoleModel, UserModel } from "..";

export interface StaffResponse extends MetaPagination {
  data: StaffModel[];
}

export interface StaffModel{
  userId: string;
  role: RoleModel;
  user: UserModel;
}
