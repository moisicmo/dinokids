import type { BranchModel, FormUserModel, FormUserValidations, RoleModel, UserRequest } from "..";


export interface StaffRequest extends  UserRequest{
  roleId: string;
  brancheIds: string[];
}

export interface FormStaffModel extends FormUserModel {
  role: RoleModel|null;
  branches: BranchModel[];
}

export interface FormStaffValidations extends FormUserValidations {
  role: [(value: RoleModel) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
}
