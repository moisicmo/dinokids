import { useEffect, useState, type FormEvent } from 'react';
import { useRoomStore, useForm, useBranchStore, useTeacherStore, useSpecialtyStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom, SliderCustom } from '@/components';
import type { RoomModel, FormRoomModel, FormRoomValidations } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: RoomModel | null;
}

const formFields: FormRoomModel = {
  name: '',
  capacity: 0,
  rangeYears: [5, 5],
  branch: null,
  teacher: null,
  specialty: null,
};

const formValidations: FormRoomValidations = {
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  capacity: [(value) => value > 0, 'Debe ingresar la capacidad'],
  rangeYears: [(value) => value.length > 0, 'Debe ingresar rango de edad'],
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  teacher: [(value) => value != null, 'Debe ingresar el profesor'],
  specialty: [(value) => value != null, 'Debe ingresar la especialidad'],
};

export const RoomCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createRoom, updateRoom } = useRoomStore();
  const { dataBranch, getBranches } = useBranchStore();
  const { dataTeacher, getTeachers } = useTeacherStore();
  const { dataSpecialty, getSpecialtiesByBranch } = useSpecialtyStore();

  const {
    name,
    capacity,
    rangeYears,
    branch,
    teacher,
    specialty,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    nameValid,
    capacityValid,
    rangeYearsValid,
    branchValid,
    teacherValid,
    specialtyValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createRoom({
        name: name.trim(),
        capacity: parseInt(capacity),
        rangeYears,
        branchId: branch.id,
        teacherId: teacher.id,
        specialtyId: specialty.id,
      });
    } else {
      await updateRoom(item.id, {
        name: name.trim(),
        capacity: parseInt(capacity),
        rangeYears,
        branchId: branch.id,
        teacherId: teacher.id,
        specialtyId: specialty.id,
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
    getBranches();
    getTeachers();
  }, [])

  useEffect(() => {
    onValueChange('specialty', null);
    if (branch == null) return;
    getSpecialtiesByBranch(branch.id);
  }, [branch])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nueva Aula'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <InputCustom
            name="name"
            value={name}
            label="Nombre"
            onChange={onInputChange}
            error={!!nameValid && formSubmitted}
            helperText={formSubmitted ? nameValid : ''}
          />
          <InputCustom
            name="capacity"
            value={capacity}
            label="Capacidad"
            onChange={onInputChange}
            error={!!capacityValid && formSubmitted}
            helperText={formSubmitted ? capacityValid : ''}
          />
          <SliderCustom
            label="Selecciona el rango de años"
            value={rangeYears}
            onChange={(value) => onValueChange('rangeYears', value)}
            min={5}
            max={15}
            step={1}
            error={!!rangeYearsValid && formSubmitted}
            helperText={formSubmitted ? rangeYearsValid : ''}
          />
          <SelectCustom
            label="Sucursal"
            options={dataBranch.data?.map((branch) => ({ id: branch.id, value: branch.name })) ?? []}
            selected={branch ? { id: branch.id, value: branch.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selected = dataBranch.data?.find((r) => r.id === value.id);
                onValueChange('branch', selected);

              }
            }}
            error={!!branchValid && formSubmitted}
            helperText={formSubmitted ? branchValid : ''}
          />
          <SelectCustom
            label="Profesor"
            options={dataTeacher.data?.map((teacher) => ({ id: teacher.id, value: teacher.name })) ?? []}
            selected={teacher ? { id: teacher.id, value: teacher.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selected = dataTeacher.data?.find((r) => r.id === value.id);
                onValueChange('teacher', selected);
              }
            }}
            error={!!teacherValid && formSubmitted}
            helperText={formSubmitted ? teacherValid : ''}
          />
          {
            branch &&
            <SelectCustom
              label="Especialidad"
              options={dataSpecialty.data?.map((specialty) => ({ id: specialty.id, value: specialty.branchSpecialties[0].specialty.name })) ?? []}
              selected={specialty ? { id: specialty.id, value: specialty.branchSpecialties[0].specialty.name } : null}
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  const selected = dataSpecialty.data?.find((r) => r.id === value.id);
                  onValueChange('specialty', selected);
                }
              }}
              error={!!specialtyValid && formSubmitted}
              helperText={formSubmitted ? specialtyValid : ''}
            />
          }
          <div className="flex justify-end gap-2 pt-2">
            <ButtonCustom
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              text='Cancelar'
              color='bg-gray-400'
            />
            <ButtonCustom
              type='submit'
              text={item ? 'Editar' : 'Crear'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};