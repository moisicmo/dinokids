import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useBranchStore } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom, SelectCustom, UserFormFields, type ValueSelect } from '@/components';
import { type BranchModel, type TeacherModel, formTeacherInit, formTeacherValidations, AcademicStatus, type TeacherRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: TeacherModel | null;
  onCreate: (body: TeacherRequest) => void;
  onUpdate: (id: string, body: TeacherRequest) => void;
}

export const TeacherCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataBranch, getBranches } = useBranchStore();

  const {
    user,
    major,
    academicStatus,
    startJob,
    branches,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    userValid,
    majorValid,
    academicStatusValid,
    startJobValid,
    branchesValid,
  } = useForm(item ?? formTeacherInit, formTeacherValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone,
        cityId: user.address.city.id,
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
      });
    } else {
      await onUpdate(item.userId, {
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone,
        cityId: user.address.city.id,
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
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
  }, [])

  const academicStatusOptions: ValueSelect[] = Object.entries(AcademicStatus).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.user.name}` : 'Nuevo Profesor'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <SelectCustom
            multiple
            label="Sucursales"
            options={dataBranch.data?.map((branch) => ({ id: branch.id, value: branch.name })) ?? []}
            selected={branches.map((s: BranchModel) => ({ id: s.id, value: s.name }))}
            onSelect={(values) => {
              if (Array.isArray(values)) {
                const select = dataBranch.data?.filter((r) =>
                  values.some((v) => v.id === r.id)
                ) ?? [];
                onValueChange('branches', select);
              }
            }}
            error={!!branchesValid && formSubmitted}
            helperText={formSubmitted ? branchesValid : ''}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UserFormFields
              user={user}
              userValid={userValid}
              formSubmitted={formSubmitted}
              onInputChange={onInputChange}
              onValueChange={onValueChange}
            />
            <InputCustom
              name="major"
              value={major}
              label="Grado"
              onChange={onInputChange}
              error={!!majorValid && formSubmitted}
              helperText={formSubmitted ? majorValid : ''}
            />
            <SelectCustom
              label="Estado académico"
              options={academicStatusOptions}
              selected={
                academicStatus
                  ? academicStatusOptions.find((opt) => opt.id === academicStatus) ?? null
                  : null
              }
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  onValueChange('academicStatus', value.id as AcademicStatus);
                }
              }}
              error={!!academicStatusValid && formSubmitted}
              helperText={formSubmitted ? academicStatusValid : ''}
            />
            <DateTimePickerCustom
              name="fecha"
              label="Fecha de inicio"
              mode="date"
              value={startJob}
              onChange={(val) => onValueChange('startJob', val)}
              error={!!startJobValid && formSubmitted}
              helperText={formSubmitted ? startJobValid : ''}
            />
          </div>
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