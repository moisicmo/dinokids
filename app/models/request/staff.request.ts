import { formUserInit, formUserValidations, type BranchModel, type FormUserModel, type FormUserValidations, type RoleModel, type UserRequest } from "..";


export interface StaffRequest extends  UserRequest{
  roleId: string;
  brancheIds: string[];
}

export interface FormStaffModel {
  user: FormUserModel,
  role: RoleModel|null;
  branches: BranchModel[];
}
export const formStaffInit: FormStaffModel = {
  user: formUserInit,
  role: null,
  branches: [],
};

export interface FormStaffValidations {
  user: FormUserValidations;
  role: [(value: RoleModel) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
}

export const formStaffValidations: FormStaffValidations = {
  user: formUserValidations,
  role: [(value) => value != null, 'Debe ingresar un rol'],
  branches: [(value) => value.length > 0, 'Debe ingresar al menos una sucursal'],
};