import type { InscriptionModel, MetaPagination } from "..";

export interface InscriptionDebtResponse extends MetaPagination {
  data: InscriptionDebtModel[];
}

export interface InscriptionDebtModel {
  id: string;
  inscription: InscriptionModel;
  type: string;
  totalAmount: string;
  remainingBalance: string;
  // payments:
}
