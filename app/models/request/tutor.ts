import type { FormUserModel, FormUserValidations, UserRequest } from "..";

export interface TutorRequest extends UserRequest  {
  city: string;
  zone: string;
  address: string;
}

export interface FormTutorModel extends FormUserModel {
  city: string;
  zone: string;
  address: string;
}

export interface FormTutorValidations extends FormUserValidations {
  city: [(value: string) => boolean, string];
  zone: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
}
