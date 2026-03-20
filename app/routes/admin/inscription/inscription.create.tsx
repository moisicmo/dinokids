import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useStudentStore } from '@/hooks';
import { Button, InputCustom, SelectCustom } from '@/components';
import { type FormAssignmentRoomModel, type InscriptionModel, type InscriptionRequest, formInscriptionInit, formInscriptionValidations } from '@/models';
import { AssignmentRoomForm } from '.';
import { StudentCreate } from '../student/student.create';

const dayOfWeekToJsDay: Record<string, number> = {
  MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};

const isAssignmentRoomInvalid = (room: FormAssignmentRoomModel) => {
  if (!room.room || !room.start || room.assignmentSchedules.length === 0) return true;
  const allowedDays = [...new Set(
    room.assignmentSchedules.map(s => dayOfWeekToJsDay[s.day] ?? -1).filter(d => d !== -1)
  )];
  return allowedDays.length > 0 && !allowedDays.includes(new Date(room.start).getDay());
};

interface Props {
  open: boolean;
  handleClose: () => void;
  item: InscriptionModel | null;
  onCreate: (body: InscriptionRequest) => void;
  onUpdate: (id: string, body: InscriptionRequest) => void;
}

export const InscriptionCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataStudent, getStudents, createStudent } = useStudentStore();

  const {
    student,
    inscriptionPrice,
    monthPrice,
    assignmentRooms,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    onArrayChange,
    studentValid,
    inscriptionPriceValid,
    monthPriceValid,
    assignmentRoomsValid,
  } = useForm(item ?? formInscriptionInit, formInscriptionValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    const hasInvalid = assignmentRooms.some((room: FormAssignmentRoomModel) =>
      isAssignmentRoomInvalid(room)
    );
    if (hasInvalid) return;
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        studentId: student.userId,
        inscriptionPrice: parseFloat(inscriptionPrice),
        monthPrice: parseFloat(monthPrice),
        assignmentRooms: [
          ...assignmentRooms.map((assignmentRoom: FormAssignmentRoomModel) => ({
            roomId: assignmentRoom.room?.id,
            start: assignmentRoom.start,
            assignmentSchedules: assignmentRoom.assignmentSchedules
          }))
        ],
      });
    } else {
      await onUpdate(item.id, {
        studentId: student.userId,
        inscriptionPrice: parseFloat(inscriptionPrice),
        monthPrice: parseFloat(monthPrice),
        assignmentRooms: [
          ...assignmentRooms.map((assignmentRoom: FormAssignmentRoomModel) => ({
            roomId: assignmentRoom.room?.id,
            start: assignmentRoom.start,
            assignmentSchedules: assignmentRoom.assignmentSchedules
          }))
        ],
      });
    }

    handleClose();
    onResetForm();
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);

  useEffect(() => {
    getStudents();
  }, [])

  if (!open) return null;


  return (
    <>
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar inscripción' : 'Nueva Inscripción'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">

          <div className="flex space-x-2 mb-4">
            {
              step === 1 &&
              <div className="w-full space-y-1">
                <SelectCustom
                  label="Estudiante"
                  options={dataStudent.data?.map((student) => ({ id: student.userId, value: `${student.user.name} ${student.user.lastName}` })) ?? []}
                  selected={student ? { id: student.id, value: `${student.user.name} ${student.user.lastName}` } : null}
                  onSelect={(value) => {
                    if (value && !Array.isArray(value)) {
                      const selected = dataStudent.data?.find((r) => r.userId === value.id);
                      onValueChange('student', selected);
                    }
                  }}
                  onSearch={(keys) => getStudents(1, 20, keys)}
                  error={!!studentValid && formSubmitted}
                  helperText={formSubmitted ? studentValid : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowStudentModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  + Crear nuevo estudiante
                </button>
              </div>
            }
            {
              step === 2 &&
              <AssignmentRoomForm
                assignmentRooms={assignmentRooms}
                onChange={(newAssignmentRooms) => onArrayChange('assignmentRooms', newAssignmentRooms)}
                formSubmitted={formSubmitted}
                assignmentRoomsValid={assignmentRoomsValid}
              />
            }
            {
              step === 3 &&
              <div className="flex gap-4 w-full">
                <div className="flex-1">
                  <InputCustom
                    name="inscriptionPrice"
                    value={inscriptionPrice}
                    label="Precio de la inscripción"
                    onChange={onInputChange}
                    error={!!inscriptionPriceValid && formSubmitted}
                    helperText={formSubmitted ? inscriptionPriceValid : ''}
                  />
                </div>
                <div className="flex-1">
                  <InputCustom
                    name="monthPrice"
                    value={monthPrice}
                    label="Precio de la mensualidad"
                    onChange={onInputChange}
                    error={!!monthPriceValid && formSubmitted}
                    helperText={formSubmitted ? monthPriceValid : ''}
                  />
                </div>
              </div>
            }
          </div>
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={() => {
                if (step === 1) {
                  onResetForm();
                  handleClose();
                } else {
                  setStep(step - 1);
                }
              }}
              >{step === 1 ? 'Cancelar' : 'Atrás'}</Button>

            {(step === 1 || step === 2) && (
              <Button
                type="button"
                onClick={() => {
                  setFormSubmitted(true);

                  if (step === 1) {
                    const hasError = !!studentValid;
                    if (hasError) return;
                    setStep(2);
                  }

                  if (step === 2) {
                    setFormSubmitted(true);
                    const hasInvalid = assignmentRooms.some((room: FormAssignmentRoomModel) =>
                      isAssignmentRoomInvalid(room)
                    );
                    if (hasInvalid) return;
                    setStep(3);
                  }
                }}
              >Siguiente</Button>
            )}
            {step === 3 && (
              <Button
                type="submit"
              >{item ? 'Editar' : 'Crear'}</Button>
            )}
          </div>
        </form>
      </div>
    </div>

    <StudentCreate
      open={showStudentModal}
      handleClose={() => setShowStudentModal(false)}
      item={null}
      onCreate={createStudent}
      onUpdate={async () => {}}
      variant="drawer"
    />
    </>
  );
};