import { useCallback, useState } from 'react';
import type { StudentModel, UserModel } from '@/models';
import { ButtonCustom } from '@/components';
import { StudentCreate, StudentTable } from '.';

const studentView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<StudentModel | null>(null);

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
            birthdate:  new Date(itemEdit.birthdate),
           }}
        />
      )}
    </>
  );
};

export default studentView