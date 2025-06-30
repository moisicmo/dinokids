import { useCallback, useState } from 'react';
import type { InscriptionModel } from '@/models';
import { BookingCreate, BookingTable } from '.';
import { ButtonCustom } from '@/components';

const bookingView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<InscriptionModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Reservas</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nueva Reserva'
        />
      </div>

      {/* Tabla de booking */}
      <BookingTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <BookingCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            assignmentRooms:itemEdit.assignmentRooms.map(assigmentRoom=>{
              return {
                ...assigmentRoom,
                start: new Date(assigmentRoom.start), 
              }
            })
          }}
        />
      )}
    </>
  );
};

export default bookingView;