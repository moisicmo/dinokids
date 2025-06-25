import { useCallback, useState } from 'react';
import type { UserModel } from '@/models';
import { StaffCreate, StaffTable } from '.';
import { ButtonCustom } from '@/components';

const staffView = () => {
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
        <h2 className="text-xl font-semibold text-gray-800">Staffs</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo staff'
        />
      </div>

      {/* Tabla de staff */}
      <StaffTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <StaffCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit, ...itemEdit.staff }}
        />
      )}
    </>
  );
};

export default staffView