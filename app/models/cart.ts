import type { FormPaymentModel, InscriptionDebtModel, StudentModel } from ".";

export interface CartModel {
  student:StudentModel;
  inscriptionDebtModel: InscriptionDebtModel,
  paymentModel: FormPaymentModel,
}

/* FORM CART MODEL */
export interface FormCartModel {
  buyerNit: string;
  buyerName: string;
}

/*FORM CART VALIDATIONS */
export interface FormCartValidations {
  buyerNit: [(value: string) => boolean, string];
  buyerName: [(value: string) => boolean, string];
}