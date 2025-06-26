import { formUserInit, formUserValidations, type FormUserModel, type FormUserValidations, type UserRequest } from "..";

export interface TutorRequest extends UserRequest  {
  city: string;
  zone: string;
  address: string;
}

export interface FormTutorModel {
  user: FormUserModel,
  city: string;
  zone: string;
  address: string;
}

export const formTutorInit: FormTutorModel = {
  user: formUserInit,
  city: '',
  zone: '',
  address: '',
};

export interface FormTutorValidations {
  user: FormUserValidations;
  city: [(value: string) => boolean, string];
  zone: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
}

export const formTutorValidations: FormTutorValidations = {
  user: formUserValidations,
  city: [(value) => value.length > 0, 'Debe ingresar la ciudad'],
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  address: [(value) => value.length > 0, 'Debe ingresar la direccion'],
};