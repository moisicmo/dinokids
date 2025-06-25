import type { BranchModel } from "../response/branch.response";

export interface SpecialtyRequest {
  branchId: string;
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
}

export interface FormSpecialtyModel {
  branch: BranchModel | null;
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
};

export interface FormSpecialtyValidations {
  branch: [(value: BranchModel) => boolean, string];
  name: [(value: string) => boolean, string];
  numberSessions: [(value: string) => boolean, string];
  estimatedSessionCost: [(value: string) => boolean, string];
}