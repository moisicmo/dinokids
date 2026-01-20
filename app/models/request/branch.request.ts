import { formAddressInit, formAddressValidations, type FormAddressModel, type FormAddressValidations } from "..";

export interface BranchRequest {
  name: string;
  phone: string[];
  city: string;
  zone: string;
  detail: string;
}
export interface FormBranchModel {
  name: string;
  phone: string[];
  address: FormAddressModel;
};

export const formBranchFields: FormBranchModel = {
  name: '',
  phone: [''],
  address: formAddressInit,
};


interface FormBranchValidations {
  name: [(value: string) => boolean, string];
  phone: [(value: string[]) => boolean, string];
  address: FormAddressValidations;
}

export const formBranchValidations: FormBranchValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  phone: [(value) => value.length > 0 && value[0].length > 0, 'Debe ingresar el correo electrónico'],
  address: formAddressValidations,
};
