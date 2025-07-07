import { AcademicStatus, type BranchModel, type UserModel } from "..";

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
