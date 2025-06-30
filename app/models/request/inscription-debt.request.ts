
export interface InscriptionDebtRequest {
  name: string;
  address: string;
  phone: string;
}
export type FormInscriptionDebtModel = InscriptionDebtRequest;

export interface FormInscriptionDebtValidations {
  name: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
  phone: [(value: string) => boolean, string];
}