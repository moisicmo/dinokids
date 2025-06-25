import { useCallback, useState } from 'react';
import type { UserModel } from '@/models';
import { StudentCreate, StudentTable } from '.';
import { ButtonCustom } from '@/components';

const studentView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<UserModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Estudiantes</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo estudiante'
        />
      </div>

      {/* Tabla de student */}
      <StudentTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <StudentCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            ...itemEdit.student,
            birthdate:  itemEdit.student? new Date(itemEdit.student?.birthdate): null,
           }}
        />
      )}
    </>
  );
};

export default studentView