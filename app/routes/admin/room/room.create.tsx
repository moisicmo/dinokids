import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useTeacherStore, useSpecialtyStore, useAuthStore } from '@/hooks';
import { Button, InputCustom, SelectCustom, SliderCustom } from '@/components';
import { type RoomModel, formRoomValidations, formRoomInit, type FormScheduleModel, type RoomRequest, type ScheduleRequest } from '@/models';
import { ScheduleForm } from './schedule.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: RoomModel | null;
  onCreate: (body: RoomRequest) => void;
  onUpdate: (id: string, body: RoomRequest) => void;
}

export const RoomCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataTeacher, getTeachers } = useTeacherStore();
  const { dataSpecialty: dataBranchSpecialty, getSpecialties } = useSpecialtyStore();

  const {
    name,
    rangeYears,
    teacher,
    assistant,
    specialty,
    schedules,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    onArrayChange,
    nameValid,
    rangeYearsValid,
    teacherValid,
    assistantValid,
    specialtyValid,
    schedulesValid,
  } = useForm(item ?? formRoomInit, formRoomValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const { branchSelect } = useAuthStore();

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    const hasInvalid = schedules.some((schedule: FormScheduleModel) =>
      !schedule.day || !schedule.end || !schedule.start
    );
    if (hasInvalid) return;
    if (!isFormValid) return;

    if (item == null) {
      onCreate({
        name: name.trim(),
        rangeYears,
        branchId: `${branchSelect?.id}`,
        teacherId: teacher.userId,
        assistantId: assistant.userId,
        specialtyId: specialty.specialty.id,
        schedules: [
          ...schedules.map((e: ScheduleRequest) => {
            return {
              ...e,
              capacity: parseInt(`${e.capacity}`)
            }
          })
        ],
      });
    } else {
      console.log('editando')
      onUpdate(item.id, {
        name: name.trim(),
        rangeYears,
        branchId: `${branchSelect?.id}`,
        teacherId: teacher.userId,
        assistantId: assistant.userId,
        specialtyId: `${ specialty?.specialty?.id ?? specialty.id}`,
        schedules: [
          ...schedules.map((e: ScheduleRequest) => {
            return {
              ...e,
              capacity: parseInt(`${e.capacity}`)
            }
          })
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
    getTeachers();
    if (item) {
      onValueChange('specialty', specialty);
    } else {
      onValueChange('specialty', null);
    }
    if (branchSelect?.id == null) return;
    getSpecialties();
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg ${step === 2 ? 'max-w-5xl' : 'max-w-lg'} p-6 max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nueva Aula'}
        </h2>
        <form onSubmit={sendSubmit} className="space-y-4">
          <div className="flex space-x-2 mb-4">
            {
              step === 1 &&
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputCustom
                    name="name"
                    value={name}
                    label="Nombre"
                    onChange={onInputChange}
                    error={!!nameValid && formSubmitted}
                    helperText={formSubmitted ? nameValid : ''}
                  />
                </div>
                <SliderCustom
                  label="Selecciona el rango de años"
                  value={rangeYears}
                  onChange={(value) => onValueChange('rangeYears', value)}
                  min={0}
                  max={15}
                  step={1}
                  error={!!rangeYearsValid && formSubmitted}
                  helperText={formSubmitted ? rangeYearsValid : ''}
                />
                <SelectCustom
                  label="Profesor"
                  options={dataTeacher.data?.map((teacher) => ({ id: teacher.userId, value: `${teacher.user.name} ${teacher.user.lastName}` })) ?? []}
                  selected={teacher ? { id: teacher.id, value: `${teacher.user.name} ${teacher.user.lastName}` } : null}
                  onSelect={(value) => {
                    if (value && !Array.isArray(value)) {
                      const selected = dataTeacher.data?.find((r) => r.userId === value.id);
                      onValueChange('teacher', selected);
                    }
                  }}
                  error={!!teacherValid && formSubmitted}
                  helperText={formSubmitted ? teacherValid : ''}
                />
                <SelectCustom
                  label="Auxiliar"
                  options={dataTeacher.data?.map((teacher) => ({ id: teacher.userId, value: `${teacher.user.name} ${teacher.user.lastName}` })) ?? []}
                  selected={assistant ? { id: assistant.id, value: `${assistant.user.name} ${assistant.user.lastName}` } : null}
                  onSelect={(value) => {
                    if (value && !Array.isArray(value)) {
                      const selected = dataTeacher.data?.find((r) => r.userId === value.id);
                      onValueChange('assistant', selected);
                    }
                  }}
                  error={!!assistantValid && formSubmitted}
                  helperText={formSubmitted ? assistantValid : ''}
                />
                <SelectCustom
                  label="Especialidad"
                  options={dataBranchSpecialty.data?.map((branchSpecialty) => ({ id: branchSpecialty.id, value: branchSpecialty.specialty.name })) ?? []}
                  selected={specialty ? { id: specialty.id, value: `${specialty.name ?? specialty?.specialty?.name}` } : null}
                  onSelect={(value) => {
                    if (value && !Array.isArray(value)) {
                      onValueChange('specialty', null);
                      const selected = dataBranchSpecialty.data?.find((r) => r.id === value.id);
                      onValueChange('specialty', selected);
                    }
                  }}
                  error={!!specialtyValid && formSubmitted}
                  helperText={formSubmitted ? specialtyValid : ''}
                />
              </div>
            }
            {
              step === 2 &&
              <ScheduleForm
                schedules={schedules}
                onChange={(newSchedules) => onArrayChange('schedules', newSchedules)}
                formSubmitted={formSubmitted}
                schedulesValid={schedulesValid}
              />
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
              color='bg-gray-400'
            >{step === 1 ? 'Cancelar' : 'Atrás'}</Button>

            {step === 1 && (
              <Button
                onClick={() => {
                  setFormSubmitted(true);
                  // Validamos manualmente si hay algún error en los campos del paso 1
                  const hasError =
                    !!nameValid ||
                    !!rangeYearsValid ||
                    !!teacherValid ||
                    !!specialtyValid;

                  if (hasError) return; // No avanzamos si hay errores
                  setStep(2); // Avanzamos al paso 2 si todo está bien
                }}
              >
                Siguiente
              </Button>
            )}

            {step === 2 && (
              <Button
                type="submit"
              >{item ? 'Editar' : 'Crear'}</Button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};