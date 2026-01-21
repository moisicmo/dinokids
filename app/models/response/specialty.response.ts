export interface BranchSpecialtiesModel {
  id: string;
  name: string|undefined;
  numberSessions: number;
  estimatedSessionCost: number;
  specialty: SpecialtyModel;
}

export interface SpecialtyModel {
  id: string;
  name: string;
  branchSpecialties: BranchSpecialtiesModel[];
}