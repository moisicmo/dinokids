/* BRANCH OFFICE MODEL */
export interface InscriptionDebtModel {
  id: number,
  totalAmount: number,
  reaminingBalance: number,
  type: string,
  dueDate?: Date,
  payments: PaymentModel[],
}

export interface PaymentModel {
  id: number,
  reference: string,
  amount: number,
  payMethod: string,
  state: boolean,
  createdAt: Date,
  inscriptionDebt: InscriptionDebtModel
}

/* FORM BRANCH OFFICE MODEL */
export interface FormPaymentModel {
  amount: number;
  dueDate: Date|null;
}

/*FORM BRANCH OFFICE VALIDATIONS */
export interface FormPaymentValidations {
  amount: [(value: number) => boolean, string];
}
