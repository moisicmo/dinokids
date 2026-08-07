import { toast } from 'sonner';
import { confirmDialog, showLoadingOverlay, hideLoadingOverlay } from '@/store/alertUI';

// Mismos nombres y firmas que la versión con SweetAlert2 — reemplazo puro por dentro, así
// ningún caller (hooks de dominio, *.view.tsx) tuvo que tocarse. showWarning()/showDesition()
// siguen devolviendo { isConfirmed: boolean } porque los callers ya hacen
// `const result = await showWarning(); if (result.isConfirmed) { ... }`.
export const useAlertStore = () => {

  const showLoading = (title: string = 'Cargando...', description?: string) => {
    showLoadingOverlay(title, description);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showWarning = () => {
    return confirmDialog({
      title: '¿Estas seguro?',
      description: '¡No podrás revertir esto!',
      confirmText: '¡Sí, bórralo!',
      cancelText: '¡No, cancelar!',
      variant: 'destructive',
    }).then((confirmed) => ({ isConfirmed: confirmed }));
  };

  const showError = (title: string, message: string) => {
    toast.error(title, { description: message });
  };

  const showDesition = (title: string, content: string, confirmButtonText: string) => {
    return confirmDialog({
      title,
      description: content,
      confirmText: confirmButtonText,
      cancelText: '¡No, cancelar!',
    }).then((confirmed) => ({ isConfirmed: confirmed }));
  };

  const swalClose = () => {
    hideLoadingOverlay();
  };

  return {
    showLoading,
    showSuccess,
    showWarning,
    showError,
    showDesition,
    swalClose,
  };
};
