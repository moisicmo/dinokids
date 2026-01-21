export interface SpecialtyRequest {
  branchId: string;
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
}

interface FormBranchSpecialtyModel {
  name: string;
  numberSessions: number;
  estimatedSessionCost: number;
};
export const formBranchSpecialtyFields: FormBranchSpecialtyModel = {
  name: '',
  numberSessions: 0,
  estimatedSessionCost: 0,
};

interface FormBranchSpecialtyValidations {
  name: [(value: string) => boolean, string];
  numberSessions: [(value: string) => boolean, string];
  estimatedSessionCost: [(value: string) => boolean, string];
}
export const formSpecialtyValidations: FormBranchSpecialtyValidations = {
  name: [
    (value: string) => value.trim().length > 0,
    'Debe ingresar el nombre',
  ],
  numberSessions: [
    (value: number | string) => Number(value) > 0,
    'Debe ingresar el número de sesiones',
  ],
  estimatedSessionCost: [
    (value: number | string) => Number(value) > 0,
    'Debe ingresar el costo estimado por sesión',
  ],
};
