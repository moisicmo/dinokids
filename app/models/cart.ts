import type { DebtModel, StudentModel } from ".";


export interface FormPaymentModel {
  amount: number;
  dueDate: Date|null;
}
export interface CartModel {
  student:StudentModel;
  DebtModel: DebtModel,
  paymentModel: FormPaymentModel,
}

/* FORM CART MODEL */
export interface FormCartModel {
  buyerNit: string;
  buyerName: string;
}

export const formCartInit: FormCartModel = {
  buyerNit: '',
  buyerName: '',
};


/*FORM CART VALIDATIONS */
export interface FormCartValidations {
  buyerNit: [(value: string) => boolean, string];
  buyerName: [(value: string) => boolean, string];
}