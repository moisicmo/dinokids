import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useCartStore, useForm } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom } from '@/components';
import { formPaymentValidations, type FormPaymentModel } from '@/models';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  item: FormPaymentModel;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const PaymentCreate = (props: Props) => {
  const {
    open,
    item,
    anchorEl,
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

  const popoverRef = useRef<HTMLDivElement>(null);
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
    onClose();
    onResetForm();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + window.scrollY;
  const left = rect.left + window.scrollX;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-56 rounded-md bg-white shadow-lg  ring-black ring-opacity-5"
      style={{
        top: `${top + 10}px`,
        left: `${left + rect.width / 2}px`,
        transform: 'translateX(-100%)',
        position: 'absolute',
      }}


    >
      <div className=" p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Nuevo Pago</h2>
          <button
            onClick={() => {
              onResetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
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
      </div>
    </div>
  );
};
