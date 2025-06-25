import { useCallback, useState } from 'react';
import type { BranchModel } from '@/models';
import { BranchCreate, BranchTable } from '.';
import { ButtonCustom } from '@/components';

const branchView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<BranchModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sucursales</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nueva Sucursal'
        />
      </div>

      {/* Tabla de branch */}
      <BranchTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <BranchCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
        />
      )}
    </>
  );
};

export default branchView