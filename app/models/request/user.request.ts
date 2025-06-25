
export interface UserRequest {
  numberDocument: string;
  typeDocument: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface FormUserModel {
  numberDocument: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface FormUserValidations {
  numberDocument: [(value: string) => boolean, string];
  name: [(value: string) => boolean, string];
  lastName: [(value: string) => boolean, string];
  email: [(value: string) => boolean, string];
}