import { Plus, Trash2 } from 'lucide-react';
import { ButtonCustom, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { TypeAction, TypeSubject, type FormPermissionModel, type FormPermissionValidations } from '@/models';

interface Props {
  permissions: FormPermissionModel[];
  onChange: (updated: FormPermissionModel[]) => void;
  formSubmitted: boolean;
  permissionsValid?: string | null;
}

export const PermisosForm = ({ permissions, onChange, formSubmitted, permissionsValid }: Props) => {
  const handleAdd = () => {
    const nuevoPermiso: FormPermissionModel = {
      action: null,
      subject: null,
      reason: ''
    };

    onChange([...permissions, nuevoPermiso]);
  };

  const handleRemove = (index: number) => {
    const updated = permissions.filter((_, i) => i !== index);
    onChange(updated);
  };



  const handleFieldChange = (
    index: number,
    field: keyof FormPermissionModel,
    value: string
  ) => {
    const updated = [...permissions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  const actionOptions: ValueSelect[] = Object.entries(TypeAction).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  const subjectOptions: ValueSelect[] = Object.entries(TypeSubject).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Permisos:</h2>
      <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-2">
        {permissions.map((permiso, idx) => (
          <div key={idx} className="border p-4 rounded-md relative">
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectCustom
                label="Acción"
                options={actionOptions}
                selected={
                  permiso.action
                    ? actionOptions.find((opt) => opt.id === permiso.action) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'action', value.id as TypeAction);
                  }
                }}
                error={formSubmitted && !permiso.action}
                helperText={formSubmitted && !permiso.action ? 'Campo requerido' : ''}
              />
              <SelectCustom
                label="Recurso"
                options={subjectOptions}
                selected={
                  permiso.subject
                    ? subjectOptions.find((opt) => opt.id === permiso.subject) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'subject', value.id as TypeSubject);
                  }
                }}
                error={formSubmitted && !permiso.subject}
                helperText={formSubmitted && !permiso.subject ? 'Campo requerido' : ''}
              />
            </div>
            <InputCustom
              name={`reason-${idx}`}
              label="Motivo"
              value={permiso.reason}
              onChange={(e) => handleFieldChange(idx, 'reason', e.target.value)}
              error={formSubmitted && permiso.reason.trim() === ''}
              helperText={formSubmitted && permiso.reason.trim() === '' ? 'Campo requerido' : ''}
            />
          </div>
        ))}
      </div>
      {formSubmitted && permissionsValid && (
        <p className="text-sm text-red-600 font-medium">{permissionsValid}</p>
      )}
      <ButtonCustom
        onClick={handleAdd}
        text='Agregar Permiso'
      />
    </div>
  );

};
