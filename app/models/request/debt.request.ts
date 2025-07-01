import type { DebtModel } from "..";

export interface DebtRequest {
  name: string;
  address: string;
  phone: string;
}
export type FormDebtModel = DebtRequest;

export interface FormDebtValidations {
  name: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  phone: [(value: string) => boolean, string];
}


export interface FormPaymentModel {
  debt: DebtModel,
  amount: number;
  dueDate: Date|null;
}

export interface FormPaymentValidations {
  amount: [(value: number) => boolean, string];
}

export const formPaymentValidations: FormPaymentValidations = {
  amount: [(value) => value > 0, 'Debe ingresar el género'],
};