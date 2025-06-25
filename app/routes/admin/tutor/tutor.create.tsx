import { useEffect, useState, type FormEvent } from 'react';
import { useTutorStore, useForm } from '@/hooks';
import { ButtonCustom, InputCustom, type ValueSelect } from '@/components';
import { type FormTutorModel, type FormTutorValidations, type UserModel, AcademicStatus } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: any;
}

const formFields: FormTutorModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  city: '',
  zone: '',
  address: '',
};

const formValidations: FormTutorValidations = {
  numberDocument: [(value) => value.length > 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
  city: [(value) => value.length > 0, 'Debe ingresar la ciudad'],
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  address: [(value) => value.length > 0, 'Debe ingresar la direccion'],
};

export const TutorCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createTutor, updateTutor } = useTutorStore();


  const {
    numberDocument,
    name,
    lastName,
    email,
    phone,
    city,
    zone,
    address,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    handleFieldChange,
    numberDocumentValid,
    nameValid,
    lastNameValid,
    emailValid,
    phoneValid,
    cityValid,
    zoneValid,
    addressValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createTutor({
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        zone: zone.trim(),
        address: address.trim(),
      });
    } else {
      await updateTutor(item.id, {
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
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
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo Tutor'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <InputCustom
              name="numberDocument"
              value={numberDocument}
              label="Numero de documento"
              onChange={onInputChange}
              error={!!numberDocumentValid && formSubmitted}
              helperText={formSubmitted ? numberDocumentValid : ''}
            />
            <InputCustom
              name="name"
              value={name}
              label="Nombre"
              onChange={onInputChange}
              error={!!nameValid && formSubmitted}
              helperText={formSubmitted ? nameValid : ''}
            />
            <InputCustom
              name="lastName"
              value={lastName}
              label="Apellido"
              onChange={onInputChange}
              error={!!lastNameValid && formSubmitted}
              helperText={formSubmitted ? lastNameValid : ''}
            />
            <InputCustom
              name="email"
              value={email}
              label="Correo electrónico"
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={formSubmitted ? emailValid : ''}
            />
            <InputCustom
              name="phone"
              value={phone}
              type="phone"
              label="Teléfono"
              onChange={onInputChange}
              error={!!phoneValid && formSubmitted}
              helperText={formSubmitted ? phoneValid : ''}
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