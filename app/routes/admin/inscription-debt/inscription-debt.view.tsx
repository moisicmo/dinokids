import { useCallback, useState } from 'react';
import type { InscriptionDebtModel } from '@/models';
import { InscriptionDebtTable } from '.';

const inscriptionDebtView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<InscriptionDebtModel | null>(null);

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

      {/* Tabla de inscriptiondebt */}
      <InscriptionDebtTable
      />

      {/* Dialogo para crear o editar */}
      {/* {openDialog && (
        <InscriptionDebtCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
        />
      )} */}
    </>
  );
};

export default inscriptionDebtView;