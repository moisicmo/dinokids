import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useForm } from '@/hooks';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { InputCustom } from '@/components';
import { Eye, EyeOff } from 'lucide-react';
import { ValidateEmail } from './validate.email';
import { ForgotPassword } from './forgot-password';
import logo from '@/assets/images/logo.png';

const loginFormFields = {
  email: '',
  password: 'Muyseguro123*',
};

const formValidations = {
  email: [(value: any) => value.length >= 1, 'Debe ingresar su cuenta'],
  password: [(value: any) => value.length >= 4, 'La contraseña debe de tener más de 6 letras.'],
};

const Login = () => {
  const { startLogin, showValidateEmail, setShowValidateEmail } = useAuthStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { email, password, onInputChange, isFormValid, emailValid, passwordValid } =
    useForm(loginFormFields, formValidations);

  const navigate = useNavigate();

  const loginSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setFormSubmitted(true);
      if (!isFormValid) return;
      const success = await startLogin({ email, password });
      if (success) navigate('/admin/dashboard');
    } catch (_) {}
  };

  return (
    <>
      {/* "Jardín" — tarjeta centrada flotando sobre manchas verdes ambientales,
          mismo lenguaje visual que el panel de marca anterior, ya no partido en dos. */}
      <div
        className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-12"
        style={{ backgroundColor: '#F7F4E9' }}
      >
        {/* Manchas decorativas */}
        <motion.div
          className="absolute -top-24 -left-24 w-[340px] h-[340px] rounded-full"
          style={{ backgroundColor: '#6BA539', opacity: 0.9 }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -bottom-20 right-[6%] w-[260px] h-[260px] rounded-full"
          style={{ backgroundColor: '#4F7D2A', opacity: 0.55 }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-[14%] right-[10%] w-[110px] h-[110px] rounded-full"
          style={{ backgroundColor: '#B0008E', opacity: 0.7 }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute bottom-[16%] left-[8%] w-[70px] h-[70px] rounded-full"
          style={{ backgroundColor: '#6BA539', opacity: 0.5 }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-[38%] left-[4%] w-[170px] h-[170px] rounded-full"
          style={{ backgroundColor: '#4F7D2A', opacity: 0.3 }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        />

        {/* Tarjeta */}
        <motion.div
          className="relative z-10 w-full max-w-[400px] bg-card rounded-[26px] shadow-2xl px-9 py-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <img src={logo} alt="DinoKids" className="w-10" />
            <span className="font-extrabold text-lg text-foreground">
              Dino<span style={{ color: '#B0008E' }}>Kids</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={loginSubmit} className="space-y-5">
            <InputCustom
              name="email"
              value={email}
              type="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={formSubmitted ? emailValid ?? '' : ''}
            />

            <InputCustom
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              onChange={onInputChange}
              error={!!passwordValid && formSubmitted}
              helperText={formSubmitted ? passwordValid ?? '' : ''}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              className="w-full font-semibold h-11 text-sm text-white"
              style={{ backgroundColor: '#B0008E' }}
            >
              Ingresar al sistema
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: '#B0008E' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {showValidateEmail && (
        <ValidateEmail
          handleClose={() => setShowValidateEmail(null)}
          showValidateEmail={showValidateEmail}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword handleClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
};

export default Login;
