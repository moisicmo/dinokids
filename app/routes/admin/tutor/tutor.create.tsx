import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { ButtonCustom, InputCustom, type ValueSelect } from '@/components';
import { AcademicStatus, formTutorInit, formTutorValidations, type TutorModel, type TutorRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: TutorModel | null;
  onCreate: (body: TutorRequest) => void;
  onUpdate: (id: string, body: TutorRequest) => void;
}

export const TutorCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    user,
    city,
    zone,
    address,
    onInputChange,
    onResetForm,
    isFormValid,
    userValid,
    cityValid,
    zoneValid,
    addressValid,
  } = useForm(item ?? formTutorInit, formTutorValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        numberDocument:user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        city: city.trim(),
        zone: zone.trim(),
        address: address.trim(),
      });
    } else {
      await onUpdate(item.userId, {
        numberDocument:user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        city: city.trim(),
        zone: zone.trim(),
        address: address.trim(),
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

  if (!open) return null;

  const academicStatusOptions: ValueSelect[] = Object.entries(AcademicStatus).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.user.name}` : 'Nuevo Tutor'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <InputCustom
              name="user.numberDocument"
              value={user.numberDocument}
              label="Numero de documento"
              onChange={onInputChange}
              error={!!userValid?.numberDocumentValid && formSubmitted}
              helperText={formSubmitted ? userValid?.numberDocumentValid : ''}
            />
            <InputCustom
              name="user.name"
              value={user.name}
              label="Nombre"
              onChange={onInputChange}
              error={!!userValid?.nameValid && formSubmitted}
              helperText={formSubmitted ? userValid?.nameValid : ''}
            />
            <InputCustom
              name="user.lastName"
              value={user.lastName}
              label="Apellido"
              onChange={onInputChange}
              error={!!userValid?.lastNameValid && formSubmitted}
              helperText={formSubmitted ? userValid?.lastNameValid : ''}
            />
            <InputCustom
              name="user.email"
              value={user.email}
              label="Correo electrónico"
              onChange={onInputChange}
              error={!!userValid?.emailValid && formSubmitted}
              helperText={formSubmitted ? userValid?.emailValid : ''}
            />
            <InputCustom
              name="user.phone"
              value={user.phone}
              type="phone"
              label="Teléfono"
              onChange={onInputChange}
              error={!!userValid?.phoneValid && formSubmitted}
              helperText={formSubmitted ? userValid?.phoneValid : ''}
            />
            <InputCustom
              name="city"
              value={city}
              label="Ciudad"
              onChange={onInputChange}
              error={!!cityValid && formSubmitted}
              helperText={formSubmitted ? cityValid : ''}
            />
            <InputCustom
              name="zone"
              value={zone}
              label="Zona"
              onChange={onInputChange}
              error={!!zoneValid && formSubmitted}
              helperText={formSubmitted ? zoneValid : ''}
            />
            <InputCustom
              name="address"
              value={address}
              label="Direccion"
              onChange={onInputChange}
              error={!!addressValid && formSubmitted}
              helperText={formSubmitted ? addressValid : ''}
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