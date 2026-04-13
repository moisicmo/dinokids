import { useState, type FormEvent } from 'react';
import { useAuthStore, useForm, type validateEmail } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { OtpCustom } from '@/components/otp.custom';
import { MailCheck, RotateCcw, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const formFields = { pin: '', password: '', confirmPassword: '' };
const formValidations = {
  pin:             [(value: string) => value.length === 6,   'Ingresa los 6 dígitos del código'],
  password:        [(value: string) => value.length >= 8,    'La contraseña debe tener al menos 8 caracteres'],
  confirmPassword: [(value: string) => value.length > 0,     'Debes confirmar la contraseña'],
};

interface Props {
  handleClose: () => void;
  showValidateEmail: validateEmail;
}

export const ValidateEmail = ({ handleClose, showValidateEmail }: Props) => {
  const { validatePin, sendPin } = useAuthStore();

  const {
    pin, password, confirmPassword,
    onInputChange, onResetForm, isFormValid,
    pinValid, passwordValid, confirmPasswordValid,
  } = useForm(formFields, formValidations);

  const [formSubmitted, setFormSubmitted]   = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [success, setSuccess]               = useState(false);
  const [resending, setResending]           = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);

  const maskedEmail = showValidateEmail.email
    ? showValidateEmail.email.replace(/(.{2}).+(@.+)/, '$1***$2')
    : '';

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setError(null);
    try {
      await sendPin(showValidateEmail.idUser);
      // 60s cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError('No se pudo reenviar el código. Intenta de nuevo.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);

    if (!isFormValid) return;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await validatePin({
        idUser: showValidateEmail.idUser,
        pin: pin.trim(),
        newPassword: password,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Código incorrecto. Revisa tu correo e intenta de nuevo.';
      setError(msg);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-xl">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#eef6e5' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: '#6BA539' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Cuenta verificada!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tu cuenta fue activada y tu contraseña configurada correctamente.
            Ya puedes iniciar sesión.
          </p>
          <Button
            onClick={() => { onResetForm(); handleClose(); }}
            className="w-full text-white font-semibold h-11"
            style={{ backgroundColor: '#B0008E' }}
          >
            Ir a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  /* ── OTP form ── */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#fce3f4' }}
          >
            <MailCheck className="w-6 h-6" style={{ color: '#B0008E' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verifica tu cuenta</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enviamos un código de 6 dígitos a{' '}
            <span className="font-medium text-gray-700">{maskedEmail}</span>.
            Ingrésalo para activar tu cuenta y crear tu contraseña.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-4">

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código de verificación</label>
            <OtpCustom
              length={6}
              name="pin"
              value={pin}
              onChange={onInputChange}
              error={!!pinValid && formSubmitted}
              helperText={formSubmitted ? (pinValid ?? '') : ''}
            />
          </div>

          {/* Resend */}
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

          {/* New password */}
          <InputCustom
            name="password"
            value={password}
            type={showPassword ? 'text' : 'password'}
            label="Nueva contraseña"
            placeholder="Mínimo 8 caracteres"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? (passwordValid ?? '') : ''}
            endAdornment={
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 hover:text-gray-600">
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            }
          />

          {/* Confirm password */}
          <InputCustom
            name="confirmPassword"
            value={confirmPassword}
            type={showConfirm ? 'text' : 'password'}
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            onChange={onInputChange}
            error={(!!confirmPasswordValid && formSubmitted) || (formSubmitted && password !== confirmPassword)}
            helperText={formSubmitted
              ? password !== confirmPassword
                ? 'Las contraseñas no coinciden'
                : (confirmPasswordValid ?? '')
              : ''}
            endAdornment={
              <button type="button" onClick={() => setShowConfirm(p => !p)} className="text-gray-400 hover:text-gray-600">
                {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            }
          />

          {/* API error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              onClick={() => { onResetForm(); handleClose(); }}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white font-semibold h-11"
              style={{ backgroundColor: '#B0008E' }}
            >
              Verificar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
