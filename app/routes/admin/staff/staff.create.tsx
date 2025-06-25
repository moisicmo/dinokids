import { useEffect, useState, type FormEvent } from 'react';
import { useStaffStore, useForm, useRoleStore, useBranchStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom } from '@/components';
import type { FormStaffModel, FormStaffValidations, BranchModel, UserModel } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: any;
}

const formFields: FormStaffModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  phone: '',
  role: null,
  branches: [],
};

const formValidations: FormStaffValidations = {
  numberDocument: [(value) => value.length >= 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length >= 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
  role: [(value) => value != null, 'Debe ingresar un rol'],
  branches: [(value) => value.length > 0, 'Debe ingresar al menos una sucursal'],
};

export const StaffCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createStaff, updateStaff } = useStaffStore();
  const { dataRole, getRoles } = useRoleStore();
  const { dataBranch, getBranches } = useBranchStore();

  const {
    numberDocument,
    name,
    lastName,
    email,
    phone,
    role,
    branches,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    numberDocumentValid,
    nameValid,
    lastNameValid,
    emailValid,
    phoneValid,
    roleValid,
    branchesValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createStaff({
        numberDocument,
        typeDocument: 'DNI',
        name,
        lastName,
        email,
        phone,
        roleId: role?.id ?? '',
        brancheIds: branches.map((branch: BranchModel) => branch.id),
      });
    } else {
      await updateStaff(item.id, {
        numberDocument,
        typeDocument: 'DNI',
        name,
        lastName,
        email,
        phone,
        roleId: role?.id ?? '',
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
    getRoles();
    getBranches();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo Staff'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
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
            <SelectCustom
              label="Rol"
              options={dataRole.data?.map((role) => ({ id: role.id, value: role.name })) ?? []}
              selected={role ? { id: role.id, value: role.name } : null}
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  const selectedRol = dataRole.data?.find((r) => r.id === value.id);
                  onValueChange('role', selectedRol);
                }
              }}
              error={!!roleValid && formSubmitted}
              helperText={formSubmitted ? roleValid : ''}
            />
          </div>
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