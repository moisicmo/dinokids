import { useCallback, useState } from 'react';
import type { UserModel } from '@/models';
import { TeacherCreate, TeacherTable } from '.';
import { ButtonCustom } from '@/components';

const teacherView = () => {
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
        <h2 className="text-xl font-semibold text-gray-800">Profesores</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo profesor'
        />
      </div>

      {/* Tabla de teacher */}
      <TeacherTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <TeacherCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            ...itemEdit.teacher,
            startJob:  itemEdit.teacher? new Date(itemEdit.teacher.startJob): null,
           }}
        />
      )}
    </>
  );
};

export default teacherView