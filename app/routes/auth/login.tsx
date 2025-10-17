import { useState } from 'react';
import { useAuthStore, useForm } from '@/hooks';
import { useNavigate } from 'react-router';
import { Button, InputCustom } from '@/components';
import { Eye, EyeOff } from 'lucide-react';
import { ValidateEmail } from './validate.email';

const loginFormFields = {
  email: '',
  password: '',
};

const formValidations = {
  email: [(value: any) => value.length >= 1, 'Debe ingresar su cuenta'],
  password: [(value: any) => value.length >= 4, 'La contraseña debe de tener más de 6 letras.'],
};

const login = () => {
  const { startLogin, showValidateEmail, setShowValidateEmail } = useAuthStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    email,
    password,
    onInputChange,
    isFormValid,
    emailValid,
    passwordValid,
  } = useForm(loginFormFields, formValidations);

  let navigate = useNavigate();

  const loginSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setFormSubmitted(true);
      if (!isFormValid) return;
      await startLogin({ email, password });
      navigate("/admin/dashboard");
    } catch (error) {

    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-cente">DINOKIDS</h1>

          <form onSubmit={loginSubmit} className="space-y-4">
            <InputCustom
              name="email"
              value={email}
              type="email"
              label="Contraseña"
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={formSubmitted ? emailValid : ''}
            />
            <InputCustom
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              onChange={onInputChange}
              error={!!passwordValid && formSubmitted}
              helperText={formSubmitted ? passwordValid : ''}
              endAdornment={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              }
            />
            <Button
              type='submit'
              className='w-full'
            >
              INGRESAR
            </Button>
          </form>
        </div>
      </div>
      {showValidateEmail && (
        <ValidateEmail
          handleClose={() => setShowValidateEmail(null)}
          showValidateEmail={showValidateEmail}
        />
      )}
    </>
  );
};


export default login;