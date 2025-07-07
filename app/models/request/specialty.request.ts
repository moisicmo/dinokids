import type { BranchModel } from "../response/branch.response";

export interface SpecialtyRequest {
  branchId: string;
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
}

interface FormSpecialtyModel {
  branch: BranchModel | null;
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
};
export const formSpecialtyFields: FormSpecialtyModel = {
  branch: null,
  name: '',
  numberSessions: 0,
  estimatedSessionCost: 0,
};

interface FormSpecialtyValidations {
  branch: [(value: BranchModel) => boolean, string];
  name: [(value: string) => boolean, string];
  numberSessions: [(value: string) => boolean, string];
  estimatedSessionCost: [(value: string) => boolean, string];
}
export const formSpecialtyValidations: FormSpecialtyValidations = {
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  numberSessions: [(value) => value.length > 0, 'Debe ingresar el número de sesiones'],
  estimatedSessionCost: [(value) => value.length > 0, 'Debe ingresar el costo estimado por sesión'],
};