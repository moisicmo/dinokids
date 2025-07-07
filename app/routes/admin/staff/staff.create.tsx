import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useRoleStore, useBranchStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom } from '@/components';
import { type BranchModel, formStaffInit, formStaffValidations, type StaffModel, type StaffRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: StaffModel | null;
  onCreate: (body: StaffRequest) => void;
  onUpdate: (id: string, body: StaffRequest) => void;
}

export const StaffCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataRole, getRoles } = useRoleStore();
  const { dataBranch, getBranches } = useBranchStore();

  const {
    user,
    role,
    branches,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    userValid,
    roleValid,
    branchesValid,
  } = useForm(item ?? formStaffInit, formStaffValidations);

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
        phone: user.phone.trim(),
        roleId: role?.id ?? '',
        brancheIds: branches.map((branch: BranchModel) => branch.id),
      });
    } else {
      await onUpdate(item.userId, {
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
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
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.user.name}` : 'Nuevo Staff'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
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
              type="email"
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