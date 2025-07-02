import type { InscriptionModel, MetaPagination, TypeDebt } from "..";

export interface DebtResponse extends MetaPagination {
  data: DebtModel[];
}

export interface DebtModel {
  id: string;
  inscription: InscriptionModel;
  type: TypeDebt;
  totalAmount: number;
  remainingBalance: number;
  createdAt: Date;
  dueDate?: Date;
  // payments:
}
