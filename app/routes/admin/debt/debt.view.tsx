import { useCallback, useState } from 'react';
import type { DebtModel } from '@/models';
import { DebtTable } from '.';

const DebtView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<DebtModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Pagos</h2>
        {/* <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nuevo cobro'
        /> */}
      </div>

      <DebtTable
      />

      {/* Dialogo para crear o editar */}
      {/* {openDialog && (
        <DebtCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
        />
      )} */}
    </>
  );
};

export default DebtView;