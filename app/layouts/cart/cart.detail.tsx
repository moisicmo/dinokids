import { ButtonCustom, InputCustom } from "@/components"
import { useCartStore, useForm } from "@/hooks";
import { formCartInit, formCartValidations } from "@/models";
import { useState, type FormEvent } from "react";

export const CartDetail = () => {


  const [formSubmitted, setFormSubmitted] = useState(false);
  const { cart } = useCartStore();

  const {
    buyerNit,
    buyerName,
    onInputChange,
    isFormValid,
    onResetForm,
    buyerNitValid,
    buyerNameValid
  } = useForm(formCartInit, formCartValidations);

  const sendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    console.log('pagando');
    // payInscriptionDebt({
    //   cart: [...cart.map((item) => {
    //     return {
    //       inscriptionDebtId: item.inscriptionDebtModel.id,
    //       ...item.paymentModel
    //     };
    //   })],
    //   buyerNit,
    //   buyerName,
    // });

    onResetForm();
  }



  return (
    <div>
      <div className="flex justify-between pb-2.5">
        <p>Estudiante:</p>
        <p>{cart[0].debt.inscription.student?.user.name??cart[0].debt.inscription.booking?.name}</p>
      </div>

      <form onSubmit={sendSubmit}>
        <InputCustom
          name="buyerNit"
          value={buyerNit}
          label="Número de facturación"
          onChange={onInputChange}
          error={!!buyerNitValid && formSubmitted}
          helperText={formSubmitted ? buyerNitValid : ""}
        />
        <InputCustom
          name="buyerName"
          value={buyerName}
          label="Nombre de facturación"
          onChange={onInputChange}
          error={!!buyerNameValid && formSubmitted}
          helperText={formSubmitted ? buyerNameValid : ""}
        />
        <ButtonCustom
            type="submit"
            text="Pagar"
            className='w-full'/>

      </form>


    </div>
  )
}
