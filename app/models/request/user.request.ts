
export interface UserRequest {
  numberDocument: string;
  typeDocument: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

// formulario
export interface FormUserModel {
  numberDocument: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

export const formUserInit: FormUserModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  phone: '',
};

// formulario de validacion
export interface FormUserValidations {
  numberDocument: [(value: string) => boolean, string];
  name: [(value: string) => boolean, string];
  lastName: [(value: string) => boolean, string];
  email: [(value: string) => boolean, string];
}

export const formUserValidations: FormUserValidations = {
  numberDocument: [(value) => value.length > 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
};