import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, InputCustom, SelectCustom, ValueSelect } from '@/components';
import { formPermissionInit, formPermissionValidations, TypeAction, TypeSubject, type PermissionModel, type PermissionRequest } from '@/models';
import { ConditionCreate } from './condition.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: PermissionModel | null;
  onCreate: (body: PermissionRequest) => void;
  onUpdate: (id: string, body: PermissionRequest) => void;
}

export const PermissionCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate
  } = props;

  const {
    action,
    subject,
    reason,
    conditions,
    onInputChange,
    onResetForm,
    onArrayChange,
    isFormValid,
    onValueChange,
    actionValid,
    subjectValid,
    reasonValid,
  } = useForm(item ?? formPermissionInit, formPermissionValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        action: action,
        subject: subject,
        reason: reason.trim(),
        conditions: conditions
      });
    } else {
      await onUpdate(item.id, {
        action: action,
        subject: subject,
        reason: reason.trim(),
        conditions: conditions
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
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl w-full max-w-4xl p-8 max-h-[95vh] overflow-y-auto shadow-xl">
        {/* <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.reazon}` : 'Nuevo Permiso'}
        </h2> */}

        <form onSubmit={sendSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SelectCustom
            label="Acción"
            options={actionOptions}
            selected={
              action
              ? actionOptions.find((opt) => opt.id === action) ?? null
                : null
              }
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  onValueChange('action', value.id as TypeAction);
                }
              }}
              error={!!actionValid && formSubmitted}
              helperText={formSubmitted ? actionValid : ''}
              />
          <SelectCustom
            label="Recurso"
            options={subjectOptions}
            selected={
              subject
                ? subjectOptions.find((opt) => opt.id === subject) ?? null
                : null
              }
              onSelect={(value) => {
                if (value && !Array.isArray(value)) {
                  onValueChange('subject', value.id as TypeSubject);
                }
              }}
              error={!!subjectValid && formSubmitted}
              helperText={formSubmitted ? subjectValid : ''}
              />
              </div>
          <InputCustom
            name="reason"
            value={reason}
            label="Razón o nombre"
            onChange={onInputChange}
            error={!!reasonValid && formSubmitted}
            helperText={formSubmitted ? reasonValid : ''}
          />
          <ConditionCreate
            conditions={conditions}
            onChange={(newConditions) => onArrayChange('conditions', newConditions)}
            formSubmitted={formSubmitted}
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