import { useCallback, useState } from 'react';
import type { InscriptionModel } from '@/models';
import { InscriptionCreate, InscriptionTable } from '.';
import { Button } from '@/components';
import { useInscriptionStore } from '@/hooks';

const inscriptionView = () => {
  const { dataInscription, getInscriptions, createInscription, updateInscription, deleteInscription, getPdf } = useInscriptionStore();
  
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
        <h2 className="text-xl font-semibold text-gray-800">Inscripciones</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nueva inscripción</Button>
      </div>

      {/* Tabla de inscription */}
      <InscriptionTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataInscription={dataInscription}
        onRefresh={getInscriptions}
        onDelete={deleteInscription}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <InscriptionCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            assignmentRooms: itemEdit.assignmentRooms.map(assigmentRoom => {
              return {
                ...assigmentRoom,
                start: new Date(assigmentRoom.start),
                assignmentSchedules: assigmentRoom.assignmentSchedules.map(assignmentSchedule => {
                  return {
                    ...assignmentSchedule,
                    schedule: {
                      ...assignmentSchedule.schedule,
                      start: new Date(assignmentSchedule.schedule.start),
                      end: new Date(assignmentSchedule.schedule.end),
                    }
                  }
                })
              }
            })
          }}
          onCreate={createInscription}
          onUpdate={updateInscription}
        />
      )}
    </>
  );
};

export default inscriptionView