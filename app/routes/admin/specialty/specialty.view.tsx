import { useCallback, useState } from 'react';
import type { SpecialtyModel } from '@/models';
import { SpecialtyCreate, SpecialtyTable } from '.';
import { ButtonCustom } from '@/components';
import { useSpecialtyStore } from '@/hooks';

const specialtyView = () => {
    const { dataSpecialty, getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialtyStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<SpecialtyModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);


  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Especialidades</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nueva Especialidad'
        />
      </div>

      {/* Tabla de specialty */}
      <SpecialtyTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataSpecialty={dataSpecialty}
        onRefresh={getSpecialties}
        onDelete={deleteSpecialty}
      />


      {/* Dialogo para crear o editar */}
      {openDialog && (
        <SpecialtyCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createSpecialty}
          onUpdate={updateSpecialty}
        />
      )}
    </>
  );
};

export default specialtyView