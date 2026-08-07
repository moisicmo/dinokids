// Store externo (no Redux) para los dos casos de useAlert.ts que necesitan estado imperativo
// fuera del árbol de React: un overlay de carga que cualquier hook puede prender/apagar, y un
// diálogo de confirmación que se resuelve como una Promise<boolean> (mismo patrón que ya usaban
// los callers con SweetAlert2 — `const result = await showWarning(); if (result.isConfirmed)`).
// No usa Redux porque necesita guardar la función `resolve` de la promesa, que no es serializable.

type Listener = () => void;

interface LoadingState {
  visible: boolean;
  title: string;
  description?: string;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  // Diálogos de "solo confirmar" (ej. "Tu perfil fue actualizado, vuelve a iniciar sesión")
  // que no tienen una opción real de cancelar — equivalente a un Swal.fire de un solo botón.
  hideCancel?: boolean;
}

interface ConfirmState extends Required<Omit<ConfirmOptions, 'description'>> {
  open: boolean;
  description?: string;
  resolve: ((value: boolean) => void) | null;
}

let loadingState: LoadingState = { visible: false, title: '' };
let confirmState: ConfirmState = {
  open: false,
  title: '',
  description: undefined,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'default',
  hideCancel: false,
  resolve: null,
};

const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLoadingState() {
  return loadingState;
}

export function getConfirmState() {
  return confirmState;
}

// Llamarlo de nuevo mientras ya está visible actualiza el texto en vivo (reemplaza a
// Swal.update() — usado por ejemplo durante operaciones largas encadenadas).
export function showLoadingOverlay(title: string, description?: string) {
  loadingState = { visible: true, title, description };
  emit();
}

export function hideLoadingOverlay() {
  loadingState = { visible: false, title: '', description: undefined };
  emit();
}

// Devuelve una promesa que se resuelve cuando el usuario confirma o cancela — el host
// (ConfirmDialogHost) es el único que llama a resolveConfirm().
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    confirmState = {
      open: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText ?? 'Confirmar',
      cancelText: options.cancelText ?? 'Cancelar',
      variant: options.variant ?? 'default',
      hideCancel: options.hideCancel ?? false,
      resolve,
    };
    emit();
  });
}

export function resolveConfirm(value: boolean) {
  confirmState.resolve?.(value);
  confirmState = { ...confirmState, open: false, resolve: null };
  emit();
}
