import { AcademicStatus, type BranchModel, type MetaPagination, type UserModel } from "..";


export interface TeacherResponse extends MetaPagination {
  data: UserModel[];
}

export interface TeacherModel  {
  id: number;
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  branches: BranchModel[];
  user: UserModel
}
