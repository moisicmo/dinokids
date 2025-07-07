import type { BranchModel } from "..";

export interface BranchSpecialtiesModel {
  numberSessions: number;
  estimatedSessionCost: number;
  specialty: SpecialtyModel;
  branch: BranchModel;
}

export interface SpecialtyModel {
  id: string;
  name: string;
  branchSpecialties: BranchSpecialtiesModel[];
}