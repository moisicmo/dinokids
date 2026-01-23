import { useState } from 'react';
import { useAuthStore } from '@/hooks';
import { Button } from '@/components';

interface Props {
  handleClose: () => void;
}

export const Profile = (props: Props) => {
  const {
    handleClose,
  } = props;

  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Datos
        </h2>
        <h1>{`${user}`}</h1>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={() => {
              handleClose();
            }}
            color='bg-gray-400'
          >Cerrar</Button>
          <Button
            type='submit'
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};