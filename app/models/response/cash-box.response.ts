export interface CashBoxActiveModel {
  id: string;
  openedAt: string;
  initialAmount: number;
  branch: {
    id: string;
    name: string;
  };
}

export interface CashBoxByMethod {
  cash: number;
  bank: number;
  qr: number;
}

export interface CashBoxSummaryModel {
  cashBoxId: string;
  openedAt: string;
  initialAmount: number;
  totalSales: CashBoxByMethod;
  extraIncome: CashBoxByMethod;
  expenses: CashBoxByMethod;
  expectedCash: number;
}

export interface CashBoxSessionItemModel extends CashBoxSummaryModel {
  id: string;
  closedAt: string | null;
  staffName: string;
}

export interface CashBoxSessionPaymentModel {
  id: string;
  amount: number;
  payMethod: string;
  createdAt: string;
  debt: {
    type: string;
    inscription?: {
      student?: { code: string; user: { name: string; lastName: string } } | null;
      booking?: { name: string } | null;
    } | null;
  };
}

export interface CashBoxSessionMovementModel {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  payMethod: string;
  createdAt: string;
}

export interface CashBoxSessionDetailModel extends CashBoxSessionItemModel {
  branch: { id: string; name: string };
  payments: CashBoxSessionPaymentModel[];
  movements: CashBoxSessionMovementModel[];
}
