import { useEffect, useState, type FormEvent } from 'react';
import { useRoleStore, useForm } from '@/hooks';
import { ButtonCustom, InputCustom } from '@/components';
import { formRoleInit, formRoleValidations, type RoleModel } from '@/models';
import { PermissionForm } from './permission.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: RoleModel | null;
}

export const RoleCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createRole, updateRole } = useRoleStore();

  const {
    name,
    permissions,
    onInputChange,
    onResetForm,
    isFormValid,
    onArrayChange,
    nameValid,
    permissionsValid,
  } = useForm(item ?? formRoleInit, formRoleValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createRole({
        name: name.trim(),
        permissions: permissions
      });
    } else {
      await updateRole(item.id, {
        name: name.trim(),
        permissions: permissions
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


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo rol'}
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
          <PermissionForm
            permissions={permissions}
            onChange={(newPermissions) => onArrayChange('permissions', newPermissions)}
            formSubmitted={formSubmitted}
            permissionsValid={permissionsValid}
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