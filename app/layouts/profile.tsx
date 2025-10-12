import { useState, type FormEvent } from 'react';
import { useAuthStore, useForm } from '@/hooks';
import { Button, InputCustom } from '@/components';
const loginFormFields = {
  pin: '',
  password: '',
};

const formValidations = {
  pin: [(value: any) => value.length >= 1, 'Debe ingresar el pin'],
  password: [(value: any) => value.length >= 6, 'La contraseña debe de tener más de 5 caracteres.'],
};


interface Props {
  handleClose: () => void;
}

export const Profile = (props: Props) => {
  const {
    handleClose,
  } = props;

  const { validatePin } = useAuthStore();

  const {
    pin,
    password,
    onInputChange,
    onResetForm,
    isFormValid,
    pinValid,
    passwordValid
  } = useForm(loginFormFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    await validatePin({
      idUser: ` `,
      pin: pin.trim(),
      newPassword: password.trim(),
    });

    handleClose();
    onResetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Datos
        </h2>
        <form onSubmit={sendSubmit} className="space-y-4">
          <InputCustom
            name="password"
            value={password}
            label="Nombre"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? passwordValid : ''}
          />
          <InputCustom
            name="password"
            value={password}
            label="Apellido"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? passwordValid : ''}
          />
          <InputCustom
            name="password"
            value={password}
            label="Correo"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? passwordValid : ''}
          />
          <InputCustom
            name="password"
            value={password}
            label="Rol"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? passwordValid : ''}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              color='bg-gray-400'
            >Cancelar</Button>
            <Button
              type='submit'
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};