import { useCallback, useState } from 'react';
import type { RoomModel } from '@/models';
import { RoomCreate, RoomTable } from '.';
import { ButtonCustom } from '@/components';
import { useRoomStore } from '@/hooks';

const roomView = () => {
  const { dataRoom, getRooms, createRoom, updateRoom, deleteRoom } = useRoomStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<RoomModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Aulas</h2>
        <ButtonCustom
          onClick={() => handleDialog(true)}
          text='Nueva Aula'
        />
      </div>

      {/* Tabla de room */}
      <RoomTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataRoom={dataRoom}
        onRefresh={getRooms}
        onDelete={deleteRoom}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <RoomCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            schedules: [
              ...itemEdit.schedules.map(schedule => {
                return {
                  ...schedule,
                  start: new Date(schedule.start),
                  end: new Date(schedule.end),
                }
              })
            ]
          }}
          onCreate={createRoom}
          onUpdate={updateRoom}
        />
      )}
    </>
  );
};

export default roomView;