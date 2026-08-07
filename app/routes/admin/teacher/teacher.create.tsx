import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useForm, useBranchStore, useRoleStore } from '@/hooks';
import { Button, DateTimePickerCustom, InputCustom, SelectCustom, UserFormFields, type ValueSelect } from '@/components';
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

  const initialForm = useMemo(
    () => (item ? { ...item, role: item.user.role ?? null } : formTeacherInit),
    [item],
  );

  const {
    user,
    major,
    academicStatus,
    startJob,
    branches,
    role,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    userValid,
    majorValid,
    academicStatusValid,
    startJobValid,
    branchesValid,
    roleValid,
  } = useForm(initialForm, formTeacherValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { dataBranch, getBranches } = useBranchStore();
  const { dataRole, getRoles } = useRoleStore();

  useEffect(() => {
    getRoles();
    getBranches();
  }, []);

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
        city: user.address.city.trim(),
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
        numberCard: user.numberCard.trim() == '' ? null : user.numberCard.trim(),
        roleId: role?.id ?? '',
      });
    } else {
      await onUpdate(item.userId, {
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone,
        city: user.address.city.trim(),
        zone: user.address.zone.trim(),
        detail: user.address.detail.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
        numberCard: user.numberCard.trim() == '' ? null : user.numberCard.trim(),
        roleId: role?.id ?? '',
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

  const academicStatusOptions: ValueSelect[] = Object.entries(AcademicStatus).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
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
          <SelectCustom
            label="Rol"
            options={dataRole.data?.map((r) => ({ id: r.id, value: r.name })) ?? []}
            selected={role ? { id: role.id, value: role.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selectedRole = dataRole.data?.find((r) => r.id === value.id);
                onValueChange('role', selectedRole);
              }
            }}
            error={!!roleValid && formSubmitted}
            helperText={formSubmitted ? roleValid : ''}
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
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
            >
              {item ? 'Editar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};