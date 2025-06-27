import { useEffect, useState, type FormEvent } from 'react';
import { useTeacherStore, useForm, useBranchStore } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { type BranchModel, type TeacherModel, formTeacherInit, formTeacherValidations, AcademicStatus } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: TeacherModel | null;
}

export const TeacherCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createTeacher, updateTeacher } = useTeacherStore();
  const { dataBranch, getBranches } = useBranchStore();

  const {
    user,
    zone,
    address,
    major,
    academicStatus,
    startJob,
    branches,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    userValid,
    zoneValid,
    addressValid,
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
      await createTeacher({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        zone: zone.trim(),
        address: address.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
      });
    } else {
      await updateTeacher(item.userId, {
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        zone: zone.trim(),
        address: address.trim(),
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

            <InputCustom
              name="user.numberDocument"
              value={user.numberDocument}
              label="Numero de documento"
              onChange={onInputChange}
              error={!!userValid?.numberDocumentValid && formSubmitted}
              helperText={formSubmitted ? userValid?.numberDocumentValid : ''}
            />
            <InputCustom
              name="user.name"
              value={user.name}
              label="Nombre"
              onChange={onInputChange}
              error={!!userValid?.nameValid && formSubmitted}
              helperText={formSubmitted ? userValid?.nameValid : ''}
            />
            <InputCustom
              name="user.lastName"
              value={user.lastName}
              label="Apellido"
              onChange={onInputChange}
              error={!!userValid?.lastNameValid && formSubmitted}
              helperText={formSubmitted ? userValid?.lastNameValid : ''}
            />
            <InputCustom
              name="user.email"
              value={user.email}
              label="Correo electrónico"
              onChange={onInputChange}
              error={!!userValid?.emailValid && formSubmitted}
              helperText={formSubmitted ? userValid?.emailValid : ''}
            />
            <InputCustom
              name="user.phone"
              value={user.phone}
              type="phone"
              label="Teléfono"
              onChange={onInputChange}
              error={!!userValid?.phoneValid && formSubmitted}
              helperText={formSubmitted ? userValid?.phoneValid : ''}
            />
            <InputCustom
              name="zone"
              value={zone}
              label="Zona"
              onChange={onInputChange}
              error={!!zoneValid && formSubmitted}
              helperText={formSubmitted ? zoneValid : ''}
            />
            <InputCustom
              name="address"
              value={address}
              label="Direccion"
              onChange={onInputChange}
              error={!!addressValid && formSubmitted}
              helperText={formSubmitted ? addressValid : ''}
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