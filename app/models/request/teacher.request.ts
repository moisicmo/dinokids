import { AcademicStatus, formUserInit, formUserValidations, type BranchModel, type FormUserModel, type FormUserValidations, type UserRequest } from "..";

export interface TeacherRequest extends UserRequest {
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  brancheIds: number[];
}

export interface FormTeacherModel {
  user: FormUserModel;
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus | null;
  startJob: Date | null;
  branches: BranchModel[];
}

export const formTeacherInit: FormTeacherModel = {
  user: formUserInit,
  zone: '',
  address: '',
  major: '',
  academicStatus: null,
  startJob: null,
  branches: []
};

export interface FormTeacherValidations {
  user: FormUserValidations;
  zone: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  major: [(value: string) => boolean, string];
  academicStatus: [(value: AcademicStatus) => boolean, string];
  startJob: [(value: Date) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
}

export const formTeacherValidations: FormTeacherValidations = {
  user: formUserValidations,
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  address: [(value) => value.length > 0, 'Debe ingresar la direccion'],
  major: [(value) => value.length > 0, 'Debe ingresar el grado'],
  academicStatus: [(value) => value != null, 'Debe ingresar estado academico'],
  startJob: [(value) => value != null, 'Debe ingresar cuando empezará'],
  branches: [(value) => value.length > 0, 'Debe ingresar una sucursal'],
};