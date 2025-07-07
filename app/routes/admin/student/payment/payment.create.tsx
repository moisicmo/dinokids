import { useState, type FormEvent } from 'react';
import { useCartStore, useForm } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom } from '@/components';
import { formPaymentValidations, type FormPaymentModel } from '@/models';
import { PopoverContent } from '@/components/ui/popover';

interface Props {
  item: FormPaymentModel;
  onClose: ()=>void;
}

export const PaymentCreate = (props: Props) => {
  const {
    item,
    onClose,
  } = props;
  const {
    debt,
    amount,
    dueDate,
    onInputChange,
    onResetForm,
    onValueChange,
    isFormValid,
    amountValid,
    dueDateValid,
  } = useForm(item, formPaymentValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { addCard } = useCartStore();

  const sendSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    addCard({
      debt,
      amount: parseFloat(amount),
      dueDate,
    });
    onResetForm();
    onClose();
  };
  return (
    <PopoverContent className="w-60" align='end'>
        <h2 className="text-lg font-bold">Nuevo Pago</h2>
        <form onSubmit={sendSubmit} className="flex flex-col">
          <InputCustom
            name="amount"
            value={amount}
            label="Monto"
            onChange={onInputChange}
            error={!!amountValid && formSubmitted}
            helperText={formSubmitted ? amountValid : ""}
          />
          {
            (debt.remainingBalance > amount) &&
            <DateTimePickerCustom
              name="dueDate"
              label="Fecha de compromiso"
              mode="date"
              value={dueDate}
              onChange={(val) => onValueChange('dueDate', val)}
              error={!!dueDateValid && formSubmitted}
              helperText={formSubmitted ? dueDateValid : ''}
            />
          }
          <ButtonCustom type="submit" text="Agregar al carrito" />
        </form>
    </PopoverContent>
  );
};
