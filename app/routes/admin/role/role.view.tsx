import { useCallback, useState } from 'react';
import type { RoleModel } from '@/models';
import { RoleCreate, RoleTable } from '.';
import { ButtonCustom } from '@/components';

const roleView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<RoleModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo Rol'
        />
      </div>

      {/* Tabla de role */}
      <RoleTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <RoleCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
        />
      )}
    </>
  );
};

export default roleView;