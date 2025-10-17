import type { TypeAction, TypeSubject } from "..";

export interface PermissionRequest {
  action: TypeAction;
  subject: TypeSubject;
  reason: string;
  conditions: ConditionRequest[];
}

export interface ConditionRequest {
  field: string;
  operator: string;
  value: string;
}

// modelo del formulario
export interface FormPermissionModel {
  action: TypeAction|null;
  subject: TypeSubject|null;
  reason: '';
  conditions: FormConditionModel[];
}
export interface FormConditionModel {
  field: string;
  operator: string;
  value:string;
}

// inicializacion del formulario
export const formPermissionInit: FormPermissionModel = {
  action: null,
  subject: null,
  reason: '',
  conditions: [],
};

//modelo de validación de permiso
export interface FormPermissionValidations {
  action: [(value: TypeAction) => boolean, string];
  subject: [(value: TypeSubject) => boolean, string];
  reason: [(value: string) => boolean, string];
}
// inicialización de la validación de permiso
export const formPermissionValidations: FormPermissionValidations = {
  action: [(value) => value != null, 'Debe ingresar la accion'],
  subject: [(value) => value != null, 'Debe ingresar el recurso'],
  reason: [(value) => value.length > 0, 'Debe ingresar la razón'],
};
// modelo de validacion de condicion
export interface FormConditionValidations {
  field: [(value: string) => boolean, string];
  operator: [(value: string) => boolean, string];
  value: [(value: string) => boolean, string];
}
// inicializacion de validacion de condicion
export const formConditionValidations: FormConditionValidations = {
  field: [(value) => value.length > 0, 'Debe ingresar la accion'],
  operator: [(value) => value.length > 0, 'Debe ingresar el recurso'],
  value: [(value) => value.length > 0, 'Debe ingresar la razón'],
};