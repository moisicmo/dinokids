// import { useEffect, useState, type FormEvent } from 'react';
// import { useInscriptionDebtStore, useForm } from '@/hooks';
// import { ButtonCustom, InputCustom } from '@/components';
// import type { InscriptionDebtModel, FormInscriptionDebtModel, FormInscriptionDebtValidations } from '@/models';

// interface Props {
//   open: boolean;
//   handleClose: () => void;
//   item: InscriptionDebtModel | null;
// }

// const formFields: FormInscriptionDebtModel = {
//   name: '',
//   address: '',
//   phone: '',
// };

// const formValidations: FormInscriptionDebtValidations = {
//   name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
//   address: [(value) => value.length >= 1, 'Debe ingresar la dirección'],
//   phone: [(value) => value.length >= 6, 'Debe ingresar el teléfono'],
// };

// export const InscriptionDebtCreate = (props: Props) => {
//   const {
//     open,
//     handleClose,
//     item,
//   } = props;
//   const { createInscriptionDebt, updateInscriptionDebt } = useInscriptionDebtStore();

//   const {
//     name,
//     address,
//     phone,
//     onInputChange,
//     onResetForm,
//     isFormValid,
//     nameValid,
//     addressValid,
//     phoneValid,
//   } = useForm(item ?? formFields, formValidations);

//   const [formSubmitted, setFormSubmitted] = useState(false);

//   const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setFormSubmitted(true);
//     if (!isFormValid) return;

//     if (item == null) {
//       await createInscriptionDebt({ name, address, phone });
//     } else {
//       await updateInscriptionDebt(item.id, { name, address, phone });
//     }

//     handleClose();
//     onResetForm();
//   };

//   useEffect(() => {
//     if (item) {
//       setFormSubmitted(false);
//     }
//   }, [item]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">
//           {item ? 'Editar Sucursal' : 'Nueva Sucursal'}
//         </h2>

//         <form onSubmit={sendSubmit} className="space-y-4">
//           <InputCustom
//             name="name"
//             value={name}
//             label="Nombre"
//             onChange={onInputChange}
//             error={!!nameValid && formSubmitted}
//             helperText={formSubmitted ? nameValid : ''}
//           />
//           <InputCustom
//             name="address"
//             value={address}
//             label="Dirección"
//             onChange={onInputChange}
//             error={!!addressValid && formSubmitted}
//             helperText={formSubmitted ? addressValid : ''}
//           />
//           <InputCustom
//             name="phone"
//             value={phone}
//             label="Teléfono"
//             onChange={onInputChange}
//             error={!!phoneValid && formSubmitted}
//             helperText={formSubmitted ? phoneValid : ''}
//           />

//           <div className="flex justify-end gap-2 pt-2">
//             <ButtonCustom
//               onClick={() => {
//                 onResetForm();
//                 handleClose();
//               }}
//               text='Cancelar'
//               color='bg-gray-400'
//             />
//             <ButtonCustom
//               type='submit'
//               text={item ? 'Editar' : 'Crear'}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };