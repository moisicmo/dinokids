import { useEffect, useState, type FormEvent } from 'react';
import { useTeacherStore, useForm, useBranchStore } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { type FormTeacherModel, type FormTeacherValidations, type BranchModel, AcademicStatus } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: any;
}

const formFields: FormTeacherModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  zone: '',
  address: '',
  major: '',
  academicStatus: null,
  startJob: null,
  branches: []
};

const formValidations: FormTeacherValidations = {
  numberDocument: [(value) => value.length > 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  address: [(value) => value.length > 0, 'Debe ingresar la direccion'],
  major: [(value) => value.length > 0, 'Debe ingresar el grado'],
  academicStatus: [(value) => value != null, 'Debe ingresar estado academico'],
  startJob: [(value) => value != null, 'Debe ingresar cuando empezará'],
  branches: [(value) => value.length > 0, 'Debe ingresar una sucursal'],
};

export const TeacherCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createTeacher, updateTeacher } = useTeacherStore();
  const { dataBranch, getBranches } = useBranchStore();


  const {
    numberDocument,
    name,
    lastName,
    email,
    phone,
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
    handleFieldChange,
    numberDocumentValid,
    nameValid,
    lastNameValid,
    emailValid,
    phoneValid,
    zoneValid,
    addressValid,
    majorValid,
    academicStatusValid,
    startJobValid,
    branchesValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createTeacher({
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        zone: zone.trim(),
        address: address.trim(),
        major: major.trim(),
        academicStatus,
        startJob,
        brancheIds: branches.map((branch: BranchModel) => branch.id),
      });
    } else {
      await updateTeacher(item.id, {
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
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
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo Profesor'}
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
              name="numberDocument"
              value={numberDocument}
              label="Numero de documento"
              onChange={onInputChange}
              error={!!numberDocumentValid && formSubmitted}
              helperText={formSubmitted ? numberDocumentValid : ''}
            />
            <InputCustom
              name="name"
              value={name}
              label="Nombre"
              onChange={onInputChange}
              error={!!nameValid && formSubmitted}
              helperText={formSubmitted ? nameValid : ''}
            />
            <InputCustom
              name="lastName"
              value={lastName}
              label="Apellido"
              onChange={onInputChange}
              error={!!lastNameValid && formSubmitted}
              helperText={formSubmitted ? lastNameValid : ''}
            />
            <InputCustom
              name="email"
              value={email}
              label="Correo electrónico"
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={formSubmitted ? emailValid : ''}
            />
            <InputCustom
              name="phone"
              value={phone}
              type="phone"
              label="Teléfono"
              onChange={onInputChange}
              error={!!phoneValid && formSubmitted}
              helperText={formSubmitted ? phoneValid : ''}
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