import { InputCustom, SelectCustom, type ValueSelect } from "@/components"
import { Button } from "@/components/ui/button";
import { useCartStore, useForm, usePaymentStore } from "@/hooks";
import { PayMethod, formCartInit, formCartValidations, type CartRequest } from "@/models";
import { useState, type FormEvent } from "react";

const payMethodOptions: ValueSelect[] = Object.entries(PayMethod).map(([key, value]) => ({ id: key, value }));

export const CartDetail = () => {


  const [formSubmitted, setFormSubmitted] = useState(false);
  const { cart } = useCartStore();
  const { sentPayments } = usePaymentStore();

  const {
    buyerNit,
    buyerName,
    payMethod,
    onInputChange,
    onValueChange,
    isFormValid,
    onResetForm,
    buyerNitValid,
    buyerNameValid,
    payMethodValid,
  } = useForm(formCartInit, formCartValidations);

  const sendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    console.log('pagando');
    const request: CartRequest = {
      buyerNit: buyerNit.trim(),
      buyerName: buyerName.trim(),
      payMethod: payMethod as PayMethod,
      payments: cart.map(cart => ({
        debtId: cart.debt.id,
        amount: cart.amount,
        dueDate: cart.dueDate
      }))
    }
    sentPayments(request);

    onResetForm();
  }



  return (
    <div>
      <div className="flex justify-between pb-2.5">
        <p>Estudiante:</p>
        <p>{cart[0].debt.inscription.student?.user.name ?? cart[0].debt.inscription.booking?.name}</p>
      </div>
      <form onSubmit={sendSubmit} className="space-y-4" >
        <InputCustom
          name="buyerNit"
          value={buyerNit}
          label="Número de comprobante"
          onChange={onInputChange}
          error={!!buyerNitValid && formSubmitted}
          helperText={formSubmitted ? buyerNitValid : ""}
        />
        <InputCustom
          name="buyerName"
          value={buyerName}
          label="Nombre de comprobante"
          onChange={onInputChange}
          error={!!buyerNameValid && formSubmitted}
          helperText={formSubmitted ? buyerNameValid : ""}
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
        <Button
          type="submit"
          
          className='w-full'>
            Pagar
          </Button>
      </form>
    </div>
  )
}
