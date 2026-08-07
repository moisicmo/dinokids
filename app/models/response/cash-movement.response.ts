import type { CashMovementType, PayMethod } from "..";

export interface CashMovementModel {
  id: string;
  branchId: string;
  cashBoxId: string;
  type: CashMovementType;
  description: string;
  amount: number;
  payMethod: PayMethod;
  createdAt: string;
  createdBy: string;
}
