import { type FormAddressModel, type FormAddressValidations, formAddressInit, formAddressValidations } from "..";

export interface UserRequest {
  numberDocument: string | null;
  typeDocument: string;
  name: string;
  lastName: string;
  email: string | null;
  phone: string[];
}

// formulario
export interface FormUserModel {
  numberDocument?: string| null;
  name: string;
  lastName: string;
  email?: string | null;
  phone?: string[];
  address?: FormAddressModel;
}

export const formUserInit: FormUserModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  phone: [''],
  address: formAddressInit,
};

// formulario de validacion
export interface FormUserValidations {
  numberDocument?: [(value: string) => boolean, string];
  name: [(value: string) => boolean, string];
  lastName: [(value: string) => boolean, string];
  email?: [(value: string) => boolean, string];
  phone?: [(value: string[]) => boolean, string];
  address?: FormAddressValidations;
}

export const formUserValidations: FormUserValidations = {
  numberDocument: [(value) => value.length > 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  // email: [(value) =>  value.length > 0, 'Debe ingresar el correo electrónico'],
  phone: [(value) => value.length > 0 && value[0].length > 0, 'Debe ingresar el correo electrónico'],
  address: formAddressValidations,
};