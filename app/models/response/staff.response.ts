import type { BranchModel, UserModel } from "..";

export interface StaffModel{
  userId: string;
  user: UserModel;
  branches: BranchModel[];
  superStaff: boolean;
}
