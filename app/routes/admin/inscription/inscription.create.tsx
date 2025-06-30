import { useEffect, useState, type FormEvent } from 'react';
import { useInscriptionStore, useForm, useStudentStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom } from '@/components';
import { type FormAssignmentRoomModel, type InscriptionModel, formInscriptionInit, formInscriptionValidations } from '@/models';
import { AssignmentRoomForm } from '.';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: InscriptionModel | null;
}

export const InscriptionCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createInscription, updateInscription } = useInscriptionStore();
  const { dataStudent, getStudents } = useStudentStore();

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

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    const hasInvalid = assignmentRooms.some((room: FormAssignmentRoomModel) =>
      !room.room || !room.start || room.assignmentSchedules.length === 0
    );
    if (hasInvalid) return;
    if (!isFormValid) return;

    if (item == null) {
      await createInscription({
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
      await updateInscription(item.id, {
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

  if (!open) return null;

  useEffect(() => {
    getStudents();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg ${step === 2 ? 'max-w-5xl' : 'max-w-lg'} p-6 max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar inscripción' : 'Nueva Inscripción'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">

          <div className="flex space-x-2 mb-4">
            {
              step === 1 &&
              <SelectCustom
                label="Estudiante"
                options={dataStudent.data?.map((student) => ({ id: student.userId, value: student.user.name })) ?? []}
                selected={student ? { id: student.id, value: student.user.name } : null}
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    const selected = dataStudent.data?.find((r) => r.userId === value.id);
                    onValueChange('student', selected);
                  }
                }}
                error={!!studentValid && formSubmitted}
                helperText={formSubmitted ? studentValid : ''}
              />
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
              <div className="space-y-4">
                <InputCustom
                  name="inscriptionPrice"
                  value={inscriptionPrice}
                  label="Precio de la inscripción"
                  onChange={onInputChange}
                  error={!!inscriptionPriceValid && formSubmitted}
                  helperText={formSubmitted ? inscriptionPriceValid : ''}
                />
                <InputCustom
                  name="monthPrice"
                  value={monthPrice}
                  label="Precio de la mensualidad"
                  onChange={onInputChange}
                  error={!!monthPriceValid && formSubmitted}
                  helperText={formSubmitted ? monthPriceValid : ''}
                />
              </div>
            }
          </div>
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <ButtonCustom
              onClick={() => {
                if (step === 1) {
                  onResetForm();
                  handleClose();
                } else {
                  setStep(step - 1);
                }
              }}
              text={step === 1 ? 'Cancelar' : 'Atrás'}
              color='bg-gray-400'
            />

            {(step === 1 || step === 2) && (
              <ButtonCustom
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
                      !room.room || !room.start || room.assignmentSchedules.length === 0
                    );
                    if (hasInvalid) return;
                    setStep(3);
                  }

                }}
                text="Siguiente"
              />
            )}
            {step === 3 && (
              <ButtonCustom
                type="submit"
                text={item ? 'Editar' : 'Crear'}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};