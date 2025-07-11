import { AcademicStatus, type BranchModel, type UserModel } from "..";

export interface TeacherModel  {
  userId: string;
  major: string;
  academicStatus: AcademicStatus;
  startJob: Date;
  branches: BranchModel[];
  user: UserModel;
}
