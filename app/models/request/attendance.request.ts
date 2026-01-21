import type { BranchModel } from "../response/branch.response";

export interface AttendanceRequest {
  branchId: string;
  numberCard: string;
}

interface FormAttendanceModel {
  numberCard: string;

};
export const formAttendanceFields: FormAttendanceModel = {
  numberCard: '',

};

interface FormAttendanceValidations {
  numberCard: [(value: string) => boolean, string];

}
export const formAttendanceValidations: FormAttendanceValidations = {
  numberCard: [(value) => value.length >= 1, 'Debe ingresar número de tarjeta'],
};