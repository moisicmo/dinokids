import { useEffect, useState, type FormEvent } from 'react';
import { useForm, usePermissionStore } from '@/hooks';
import { Button, InputCustom, SelectCustom } from '@/components';
import { formRoleInit, formRoleValidations, type PermissionModel, type RoleModel, type RoleRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: RoleModel | null;
  onCreate: (body: RoleRequest) => void;
  onUpdate: (id: string, body: RoleRequest) => void;
}

export const RoleCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate
  } = props;

  const {
    name,
    permissions,
    onInputChange,
    onResetForm,
    isFormValid,
    onArrayChange,
    onValueChange,
    nameValid,
    permissionsValid,
  } = useForm(item ?? formRoleInit, formRoleValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { dataPermission, getPermissions } = usePermissionStore();

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        permissionIds: [...permissions.map((permission:PermissionModel)=>permission.id)],
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        permissionIds: [...permissions.map((permission:PermissionModel)=>permission.id)],
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
    getPermissions();
  }, [])


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
          <SelectCustom
            multiple
            label="Permisos"
            options={dataPermission.data?.map((permission) => ({ id: permission.id, value: `${permission.action} ${permission.subject}` })) ?? []}
            selected={permissions.map((s: PermissionModel) => ({ id: s.id, value: `${s.action} ${s.subject}` }))}
            onSelect={(values) => {
              if (Array.isArray(values)) {
                const select = dataPermission.data?.filter((r) =>
                  values.some((v) => v.id === r.id)
                ) ?? [];
                onValueChange('permissions', select);
              }
            }}
            error={!!permissionsValid && formSubmitted}
            helperText={formSubmitted ? permissionsValid : ''}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              color='bg-gray-400'
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