import { AcademicStatus, type BranchModel, type FormUserModel, type FormUserValidations, type UserRequest } from "..";

export interface TeacherRequest extends UserRequest  {
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  brancheIds: number[];
}

export interface FormTeacherModel extends FormUserModel {
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus | null;
  startJob: Date | null;
  branches: BranchModel[];
}

export interface FormTeacherValidations extends FormUserValidations {
  zone: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  major: [(value: string) => boolean, string];
  academicStatus: [(value: AcademicStatus) => boolean, string];
  startJob: [(value: Date) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
}
