import { useSyncExternalStore } from 'react';
import { subscribe, getConfirmState, resolveConfirm } from '@/store/alertUI';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Puente imperativo sobre AlertDialog (declarativo) — useAlert.ts llama confirmDialog() y
// espera la promesa, este host es el único que la resuelve según el botón que toque el usuario.
export const ConfirmDialogHost = () => {
  const state = useSyncExternalStore(subscribe, getConfirmState);

  return (
    <AlertDialog open={state.open} onOpenChange={(open) => { if (!open) resolveConfirm(false); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          {state.description && <AlertDialogDescription>{state.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!state.hideCancel && (
            <AlertDialogCancel onClick={() => resolveConfirm(false)}>{state.cancelText}</AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={() => resolveConfirm(true)}
            className={state.variant === 'destructive' ? 'bg-destructive text-white hover:bg-destructive/90' : undefined}
          >
            {state.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
