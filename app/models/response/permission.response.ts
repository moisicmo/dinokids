import type { TypeAction, TypeSubject } from "..";


export interface PermissionModel {
  id: string;
  action: TypeAction;
  subject: TypeSubject;
  inverted: boolean;
  reason: string;
  conditions: ConditionsModel[];
}

export interface ConditionsModel {
  id: string;
  field: string;
  operator: string;
  value: string;
}