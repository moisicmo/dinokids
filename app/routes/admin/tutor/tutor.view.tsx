import { useCallback, useState } from 'react';
import type { TutorModel } from '@/models';
import { TutorCreate, TutorTable } from '.';
import { Button } from '@/components';
import { useTutorStore } from '@/hooks';

const teacherView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<TutorModel | null>(null);
  const { dataTutor, getTutors, createTutor, updateTutor, deleteTutor } = useTutorStore();

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Tutores</h2>
        <Button
          onClick={() => handleDialog(true)}
        >
          Nuevo tutor
        </Button>
      </div>

      {/* Tabla de teacher */}
      <TutorTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataTutor={dataTutor}
        onRefresh={getTutors}
        onDelete={deleteTutor}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <TutorCreate
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
          onCreate={createTutor}
          onUpdate={updateTutor}
        />
      )}
    </>
  );
};

export default teacherView