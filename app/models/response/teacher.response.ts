import { AcademicStatus, type BranchModel, type MetaPagination, type UserModel } from "..";


export interface TeacherResponse extends MetaPagination {
  data: TeacherModel[];
}

export interface TeacherModel  {
  userId: string;
  zone: string;
  address: string;
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  branches: BranchModel[];
  user: UserModel;
}
