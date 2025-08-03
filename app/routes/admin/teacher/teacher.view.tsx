import { useCallback, useState } from 'react';
import type { TeacherModel } from '@/models';
import { TeacherCreate, TeacherTable } from '.';
import { Button } from '@/components';
import { useTeacherStore } from '@/hooks';

const teacherView = () => {
  const { dataTeacher, getTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeacherStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<TeacherModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Profesores</h2>
        <Button
          onClick={() => handleDialog(true)}
        >
          Nuevo profesor
        </Button>
      </div>

      {/* Tabla de teacher */}
      <TeacherTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataTeacher={dataTeacher}
        onRefresh={getTeachers}
        onDelete={deleteTeacher}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <TeacherCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            startJob: new Date(itemEdit.startJob),
          }}
          onCreate={createTeacher}
          onUpdate={updateTeacher}
        />
      )}
    </>
  );
};

export default teacherView