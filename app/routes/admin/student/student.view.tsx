import { useCallback, useState } from 'react';
import type { StudentModel, UserModel } from '@/models';
import { Button } from '@/components';
import { StudentCreate, StudentTable } from '.';
import { useStudentStore } from '@/hooks';

const studentView = () => {
  const { dataStudent, getStudents, createStudent, updateStudent, deleteStudent } = useStudentStore();

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
        <Button
          onClick={() => handleDialog(true)}
        >
          Nuevo estudiante
        </Button>
      </div>

      {/* Tabla de student */}
      <StudentTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataStudent={dataStudent}
        onRefresh={getStudents}
        onDelete={deleteStudent}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <StudentCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            birthdate: new Date(itemEdit.birthdate),
          }}
          onCreate={createStudent}
          onUpdate={updateStudent}
        />
      )}
    </>
  );
};

export default studentView