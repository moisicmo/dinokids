import { AcademicStatus, formUserInit, formUserValidations, type AddressRequest, type BranchModel, type FormUserModel, type FormUserValidations, type RoleModel, type UserRequest } from "..";

export interface TeacherRequest extends UserRequest, AddressRequest {
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  brancheIds: number[];
  roleId: string;
}

export interface FormTeacherModel {
  user: FormUserModel;
  major: string;
  academicStatus: AcademicStatus | null;
  startJob: Date | null;
  branches: BranchModel[];
  role: RoleModel | null;
}

export const formTeacherInit: FormTeacherModel = {
  user: formUserInit,
  major: '',
  academicStatus: null,
  startJob: null,
  branches: [],
  role: null,
};

export interface FormTeacherValidations {
  user: FormUserValidations;
  major: [(value: string) => boolean, string];
  academicStatus: [(value: AcademicStatus) => boolean, string];
  startJob: [(value: Date) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
  role: [(value: RoleModel) => boolean, string];
}

export const formTeacherValidations: FormTeacherValidations = {
  user: formUserValidations,
  major: [(value) => value.length > 0, 'Debe ingresar el grado'],
  academicStatus: [(value) => value != null, 'Debe ingresar estado academico'],
  startJob: [(value) => value != null, 'Debe ingresar cuando empezará'],
  branches: [(value) => value.length > 0, 'Debe ingresar una sucursal'],
  role: [(value) => value != null, 'Debe ingresar un rol'],
};