import { useCallback, useState } from 'react';
import type { TutorModel } from '@/models';
import { TutorCreate, TutorTable } from '.';
import { ButtonCustom } from '@/components';

const teacherView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<TutorModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Tutores</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo tutor'
        />
      </div>

      {/* Tabla de teacher */}
      <TutorTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <TutorCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
        />
      )}
    </>
  );
};

export default teacherView