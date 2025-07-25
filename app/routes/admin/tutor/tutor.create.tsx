import { useEffect, useState, type FormEvent } from 'react';
import { useCityStore, useForm } from '@/hooks';
import { ButtonCustom, UserFormFields } from '@/components';
import { formTutorInit, formTutorValidations, type TutorModel, type TutorRequest } from '@/models';

interface Props {
  handleClose: () => void;
  item: TutorModel | null;
  onCreate: (body: TutorRequest) => void;
  onUpdate: (id: string, body: TutorRequest) => void;
}

export const TutorCreate = (props: Props) => {
  const {
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    user,
    onInputChange,
    onResetForm,
    onValueChange,
    isFormValid,
    userValid,
  } = useForm(item ?? formTutorInit, formTutorValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { dataCity, getCityes } = useCityStore();

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone,
        cityId: user.address.city.id,
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
      });
    } else {
      await onCreate({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone,
        cityId: user.address.city.id,
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
      });
    }

    handleClose();
    onResetForm();
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);



  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.user.name}` : 'Nuevo Tutor'}
        </h2>
        <form onSubmit={sendSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UserFormFields
              user={user}
              userValid={userValid}
              formSubmitted={formSubmitted}
              onInputChange={onInputChange}
              onValueChange={onValueChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <ButtonCustom
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              text='Cancelar'
              color='bg-gray-400'
            />
            <ButtonCustom
              type='submit'
              text={item ? 'Editar' : 'Crear'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};