import { useCallback, useState } from 'react';
import { TypeAction, TypeSubject, type StudentModel } from '@/models';
import { Button } from '@/components';
import { EvaluationPlanningModal, SessionTrackingModal, StudentCreate, StudentTable, WeeklyPlanningModal } from '.';
import { usePermissionStore, useStudentStore } from '@/hooks';

const studentView = () => {
  const { dataStudent, getStudents, createStudent, updateStudent, deleteStudent } = useStudentStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<StudentModel | null>(null);

  const [sessionTracking, setSessionTracking] = useState<string | null>(null);
  const [weeklyPlanning, setWeeklyPlanning] = useState<string | null>(null);
  const [evaluationPlanning, setEvaluationPlanning] = useState<string | null>(null);
  const { hasPermission } = usePermissionStore();

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Estudiantes</h2>
        {
          hasPermission(TypeAction.create, TypeSubject.student) &&
          <Button
            onClick={() => handleDialog(true)}
          >
            Nuevo estudiante
          </Button>
        }
      </div>

      {/* Tabla de student */}
      <StudentTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataStudent={dataStudent}
        onRefresh={getStudents}
        onDelete={deleteStudent}
        onSessionTracking={setSessionTracking}
        onWeeklyPlanning={setWeeklyPlanning}
        onEvaluationPlanning={setEvaluationPlanning}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <StudentCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : {
            ...itemEdit,
            birthdate: new Date(itemEdit.birthdate),
          }}
          onCreate={createStudent}
          onUpdate={updateStudent}
        />
      )}
      {
        sessionTracking && (
          <SessionTrackingModal
            onClose={() => setSessionTracking(null)}
          />
        )
      }
      {
        weeklyPlanning && (
          <WeeklyPlanningModal
            onClose={() => setWeeklyPlanning(null)}
            item={null}
          />
        )
      }
      {
        evaluationPlanning && (
          <EvaluationPlanningModal
            onClose={() => setEvaluationPlanning(null)}
          />
        )
      }
    </>
  );
};

export default studentView