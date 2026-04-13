import { useState, type FormEvent } from 'react';
import { useAuthStore, useForm } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { OtpCustom } from '@/components/otp.custom';
import { KeyRound, RotateCcw, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface Props {
  handleClose: () => void;
}

const emailFormFields = { email: '' };
const emailFormValidations = {
  email: [(value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), 'Ingresa un correo válido'],
};

const pinFormFields = { pin: '', password: '', confirmPassword: '' };
const pinFormValidations = {
  pin: [(value: string) => value.length >= 6, 'Debe ingresar el PIN de 6 dígitos'],
  password: [(value: string) => value.length >= 8, 'La contraseña debe tener al menos 8 caracteres'],
  confirmPassword: [(value: string) => value.length > 0, 'Debe confirmar la contraseña'],
};

export const ForgotPassword = ({ handleClose }: Props) => {
  const { forgotPassword, validatePin, sendPin } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [idUser, setIdUser] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pinSubmitted, setPinSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Paso 1 — email
  const {
    email,
    onInputChange: onEmailChange,
    isFormValid: isEmailValid,
    emailValid,
    onResetForm: resetEmailForm,
  } = useForm(emailFormFields, emailFormValidations);

  // Paso 2 — OTP + nueva contraseña
  const {
    pin, password, confirmPassword,
    onInputChange: onPinChange,
    isFormValid: isPinFormValid,
    pinValid, passwordValid, confirmPasswordValid,
    onResetForm: resetPinForm,
  } = useForm(pinFormFields, pinFormValidations);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setApiError(null);
    try {
      await sendPin(idUser);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setApiError('No se pudo reenviar el código. Intenta de nuevo.');
    } finally {
      setResending(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setApiError(null);
    if (!isEmailValid) return;
    try {
      const result = await forgotPassword({ email });
      setIdUser(result.idUser);
      setUserEmail(result.email ?? email);
      setStep(2);
    } catch (error: any) {
      setApiError(error?.response?.data?.message ?? 'No se encontró una cuenta con ese correo.');
    }
  };

  const handlePinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPinSubmitted(true);
    setApiError(null);
    if (!isPinFormValid) return;
    if (password !== confirmPassword) {
      setApiError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await validatePin({ idUser, pin: pin.trim(), newPassword: password });
      setStep(3);
    } catch (error: any) {
      setApiError(error?.response?.data?.message ?? 'Código incorrecto o expirado. Intenta de nuevo.');
    }
  };

  const maskedEmail = userEmail.replace(/(.{2}).+(@.+)/, '$1***$2');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

        {/* ── Paso 3: Éxito ── */}
        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#eef6e5' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#6BA539' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Contraseña restablecida!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.
            </p>
            <Button
              onClick={handleClose}
              className="w-full text-white font-semibold h-11"
              style={{ backgroundColor: '#B0008E' }}
            >
              Ir a iniciar sesión
            </Button>
          </div>
        )}

        {/* ── Paso 1: Ingresar correo ── */}
        {step === 1 && (
          <div className="px-7 pt-7 pb-7">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fce3f4' }}>
              <KeyRound className="w-6 h-6" style={{ color: '#B0008E' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recuperar contraseña</h2>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Ingresa tu correo y te enviaremos un código de verificación.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <InputCustom
                name="email"
                value={email}
                type="email"
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                onChange={onEmailChange}
                error={!!emailValid && emailSubmitted}
                helperText={emailSubmitted ? (emailValid ?? '') : ''}
              />
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <Button type="button" onClick={handleClose} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium h-11">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 text-white font-semibold h-11" style={{ backgroundColor: '#B0008E' }}>
                  Enviar código
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── Paso 2: OTP + nueva contraseña ── */}
        {step === 2 && (
          <div className="px-7 pt-7 pb-7">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fce3f4' }}>
              <KeyRound className="w-6 h-6" style={{ color: '#B0008E' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Ingresa el código</h2>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Enviamos un código de 6 dígitos a{' '}
              <span className="font-medium text-gray-700">{maskedEmail}</span>
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código de verificación</label>
                <OtpCustom
                  length={6}
                  name="pin"
                  value={pin}
                  onChange={onPinChange}
                  error={!!pinValid && pinSubmitted}
                  helperText={pinSubmitted ? (pinValid ?? '') : ''}
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: '#B0008E' }}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0
                    ? `Reenviar en ${resendCooldown}s`
                    : resending ? 'Enviando...' : '¿No llegó? Reenviar código'}
                </button>
              </div>

              <InputCustom
                name="password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                onChange={onPinChange}
                error={!!passwordValid && pinSubmitted}
                helperText={pinSubmitted ? (passwordValid ?? '') : ''}
                endAdornment={
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 hover:text-gray-600">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                }
              />
              <InputCustom
                name="confirmPassword"
                value={confirmPassword}
                type={showConfirm ? 'text' : 'password'}
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                onChange={onPinChange}
                error={(!!confirmPasswordValid && pinSubmitted) || (pinSubmitted && password !== confirmPassword)}
                helperText={pinSubmitted
                  ? password !== confirmPassword ? 'Las contraseñas no coinciden' : (confirmPasswordValid ?? '')
                  : ''}
                endAdornment={
                  <button type="button" onClick={() => setShowConfirm(p => !p)} className="text-gray-400 hover:text-gray-600">
                    {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                }
              />

              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" onClick={() => { setApiError(null); setStep(1); }} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium h-11">
                  Atrás
                </Button>
                <Button type="submit" className="flex-1 text-white font-semibold h-11" style={{ backgroundColor: '#B0008E' }}>
                  Restablecer
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
