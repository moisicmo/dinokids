import type { DebtModel, PayMethod } from "..";

export interface PaymentModel {
  id: string;
  debt: DebtModel;
  invoice?: { id: string; code: string; url: string } | null;
  reference?: string|null;
  amount: number;
  payMethod: PayMethod;
  createdAt: Date;
}
