import { formUserInit, formUserValidations, type AddressRequest, type FormUserModel, type FormUserValidations, type UserRequest } from "..";



export interface TutorRequest extends UserRequest, AddressRequest {

}

export interface FormTutorModel {
  user: FormUserModel,
}

export const formTutorInit: FormTutorModel = {
  user: formUserInit,
};

export interface FormTutorValidations{
  user: FormUserValidations;
}

export const formTutorValidations: FormTutorValidations = {
  user: formUserValidations,
};