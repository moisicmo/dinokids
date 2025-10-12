import type { BranchModel } from "../response/branch.response";

export interface AttendanceRequest {
  branchId: string;
  numberCard: string;
}

interface FormAttendanceModel {
  branch: BranchModel | null;
  numberCard: string;

};
export const formAttendanceFields: FormAttendanceModel = {
  branch: null,
  numberCard: '',

};

interface FormAttendanceValidations {
  branch: [(value: BranchModel) => boolean, string];
  numberCard: [(value: string) => boolean, string];

}
export const formAttendanceValidations: FormAttendanceValidations = {
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  numberCard: [(value) => value.length >= 1, 'Debe ingresar número de tarjeta'],
};