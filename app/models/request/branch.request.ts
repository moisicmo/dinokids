
export interface BranchRequest {
  name: string;
  address: string;
  phone: string;
}
export type FormBranchModel = BranchRequest;

export interface FormBranchValidations {
  name: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  phone: [(value: string) => boolean, string];
}