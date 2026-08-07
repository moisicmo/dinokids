import { CashMovementType, PayMethod } from "..";

export interface CreateCashMovementRequest {
  branchId: string;
  type: CashMovementType;
  description: string;
  amount: number;
  payMethod?: PayMethod;
}

export interface FormCashMovementModel {
  description: string;
  amount: number;
  payMethod: PayMethod | null;
}

export const formCashMovementInit: FormCashMovementModel = {
  description: '',
  amount: 0,
  payMethod: null,
};

export interface FormCashMovementValidations {
  description: [(value: string) => boolean, string];
  amount: [(value: number) => boolean, string];
  payMethod: [(value: PayMethod) => boolean, string];
}

export const formCashMovementValidations: FormCashMovementValidations = {
  description: [(value) => value.trim().length > 0, 'Debe ingresar una descripción'],
  amount: [(value) => value > 0, 'Debe ingresar un monto mayor a 0'],
  payMethod: [(value) => value != null, 'Debe elegir un método de pago'],
};
