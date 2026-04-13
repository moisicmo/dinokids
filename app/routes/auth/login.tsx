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
      <div className="min-h-screen flex">

        {/* ── Panel izquierdo: branding ── */}
        <motion.div
          className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center p-12 overflow-hidden"
          style={{ backgroundColor: '#6BA539' }}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Circles decorativos — amigables */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute top-1/4 right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute bottom-1/4 left-8 w-16 h-16 rounded-full bg-white/15" />
          {/* Círculo acento magenta */}
          <div
            className="absolute top-8 right-12 w-12 h-12 rounded-full opacity-60"
            style={{ backgroundColor: '#B0008E' }}
          />

          {/* Content */}
          <div className="relative z-10 text-center text-white">
            <motion.img
              src={logo}
              alt="DinoKids"
              className="w-36 mx-auto mb-6 drop-shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.p
              className="text-white/85 text-base max-w-xs mx-auto leading-relaxed font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Sistema de gestión educativa
            </motion.p>
          </div>
        </motion.div>

        {/* ── Panel derecho: formulario ── */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Logo mobile */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
              <img src={logo} alt="DinoKids" className="w-20 mb-3" />
              <h1 className="text-2xl font-bold" style={{ color: '#B0008E' }}>DinoKids</h1>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h2>
              <p className="text-sm text-gray-500 mt-1">
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
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
