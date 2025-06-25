import type { BranchModel, MetaPagination, RoomModel } from "..";

export interface SpecialtyResponse extends MetaPagination {
  data: SpecialtyModel[];
}

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