
export interface BranchRequest {
  name: string;
  address: string;
  phone: string;
}
type FormBranchModel = BranchRequest;

export const formBranchFields: FormBranchModel = {
  name: '',
  address: '',
  phone: '',
};


interface FormBranchValidations {
  name: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  phone: [(value: string) => boolean, string];
}

export const formBranchValidations: FormBranchValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  address: [(value) => value.length >= 1, 'Debe ingresar la dirección'],
  phone: [(value) => value.length >= 6, 'Debe ingresar el teléfono'],
};
