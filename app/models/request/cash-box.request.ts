export interface OpenCashBoxRequest {
  initialAmount: number;
}

export interface FormOpenCashBoxModel {
  initialAmount: number;
}

export const formOpenCashBoxInit: FormOpenCashBoxModel = {
  initialAmount: 0,
};

export interface FormOpenCashBoxValidations {
  initialAmount: [(value: number) => boolean, string];
}

export const formOpenCashBoxValidations: FormOpenCashBoxValidations = {
  initialAmount: [(value) => value >= 0, 'El monto inicial no puede ser negativo'],
};
