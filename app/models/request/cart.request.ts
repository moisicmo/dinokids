
import { PayMethod, type PaymentRequest } from "..";
export interface CartRequest {
  buyerNit: string;
  buyerName: string;
  payments: PaymentRequest[];
  payMethod: PayMethod;
}

export interface FormCartModel {
  buyerNit: string;
  buyerName: string;
  payMethod: PayMethod | null;
}

export const formCartInit: FormCartModel = {
  buyerNit: '',
  buyerName: '',
  payMethod: null,
};
interface FormCartValidations {
  buyerNit: [(value: string) => boolean, string];
  buyerName: [(value: string) => boolean, string];
  payMethod: [(value: PayMethod) => boolean, string];
}

export const formCartValidations: FormCartValidations = {
  buyerNit: [(value) => value.length > 0, 'Debe ingresar un número de facturación'],
  buyerName: [(value) => value.length > 0, 'Debe ingresar un nombre de facturación'],
  payMethod: [(value) => value != null, 'Debe elegir un método de pago'],
};
