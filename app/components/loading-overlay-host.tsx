import { useSyncExternalStore } from 'react';
import { subscribe, getLoadingState } from '@/store/alertUI';
import { Spinner } from '@/components/ui/spinner';

// Overlay bloqueante con texto — reemplaza el Swal.fire({..., didOpen: () => Swal.showLoading()})
// que se usaba en decenas de hooks (showLoading('Creando...') / swalClose()) y en el interceptor
// de mutaciones de coffeApi.ts.
export const LoadingOverlayHost = () => {
  const state = useSyncExternalStore(subscribe, getLoadingState);

  if (!state.visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col items-center justify-center gap-3 pointer-events-auto">
      <Spinner className="size-8 text-white" />
      {state.title && <p className="text-white text-sm font-medium">{state.title}</p>}
      {state.description && <p className="text-white/70 text-xs">{state.description}</p>}
    </div>
  );
};
