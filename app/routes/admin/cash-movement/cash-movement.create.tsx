import { useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { CashMovementType, PayMethod, formCashMovementInit, formCashMovementValidations, type CreateCashMovementRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  type: CashMovementType;
  branchId: string;
  onCreate: (body: CreateCashMovementRequest) => void;
}

const payMethodOptions: ValueSelect[] = Object.entries(PayMethod).map(([key, value]) => ({ id: key, value }));

export const CashMovementCreate = ({ open, handleClose, type, branchId, onCreate }: Props) => {
  const {
    description,
    amount,
    payMethod,
    onInputChange,
    onDecimalChange,
    onValueChange,
    onResetForm,
    isFormValid,
    descriptionValid,
    amountValid,
    payMethodValid,
  } = useForm(formCashMovementInit, formCashMovementValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!open) return null;

  const isExpense = type === CashMovementType.EXPENSE;

  const sendSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    onCreate({
      branchId,
      type,
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      payMethod: payMethod ?? undefined,
    });
    onResetForm();
    setFormSubmitted(false);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {isExpense ? 'Nuevo egreso' : 'Nuevo ingreso'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <InputCustom
            name="description"
            value={description}
            label="Descripción"
            placeholder={isExpense ? 'Ej. Pago de luz' : 'Ej. Venta de materiales'}
            onChange={onInputChange}
            error={!!descriptionValid && formSubmitted}
            helperText={formSubmitted ? descriptionValid : ''}
          />
          <InputCustom
            name="amount"
            label="Monto (Bs.)"
            value={amount}
            error={!!amountValid && formSubmitted}
            helperText={formSubmitted ? amountValid : ''}
            {...onDecimalChange('amount')}
          />
          <SelectCustom
            label="Método de pago"
            options={payMethodOptions}
            selected={payMethod ? payMethodOptions.find((opt) => opt.id === payMethod) ?? null : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                onValueChange('payMethod', value.id as PayMethod);
              }
            }}
            error={!!payMethodValid && formSubmitted}
            helperText={formSubmitted ? payMethodValid : ''}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => { onResetForm(); handleClose(); }} color="bg-muted">
              Cancelar
            </Button>
            <Button type="submit">
              {isExpense ? 'Registrar egreso' : 'Registrar ingreso'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
