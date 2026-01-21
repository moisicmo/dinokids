import { useEffect, useState, type FormEvent } from 'react';
import { useAuthStore, useForm } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { formBranchSpecialtyFields, formSpecialtyValidations, type BranchSpecialtiesModel, type SpecialtyRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: BranchSpecialtiesModel | null;
  onCreate: (body: SpecialtyRequest) => void;
  onUpdate: (id: string, body: SpecialtyRequest) => void;
}

export const SpecialtyCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    name,
    numberSessions,
    estimatedSessionCost,
    onInputChange,
    onResetForm,
    isFormValid,
    nameValid,
    numberSessionsValid,
    estimatedSessionCostValid,
  } = useForm(item ?? formBranchSpecialtyFields, formSpecialtyValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { branchSelect } = useAuthStore();

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log('name', name );
    console.log('numberSessions', numberSessions );
    console.log('estimatedSessionCost', estimatedSessionCost );
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        branchId: `${branchSelect?.id}`,
        name: name.trim(),
        numberSessions: parseInt(numberSessions),
        estimatedSessionCost: parseInt(estimatedSessionCost),
      });
    } else {
      await onUpdate(item.id, {
        branchId: `${branchSelect?.id}`,
        name: name.trim(),
        numberSessions: parseInt(numberSessions),
        estimatedSessionCost: parseInt(estimatedSessionCost),
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
          {item ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
          <InputCustom
            name="numberSessions"
            value={numberSessions}
            label="Número de sesiones"
            onChange={onInputChange}
            error={!!numberSessionsValid && formSubmitted}
            helperText={formSubmitted ? numberSessionsValid : ''}
          />
          <InputCustom
            name="estimatedSessionCost"
            value={estimatedSessionCost}
            label="Costo estimado por sesión"
            onChange={onInputChange}
            error={!!estimatedSessionCostValid && formSubmitted}
            helperText={formSubmitted ? estimatedSessionCostValid : ''}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              color='bg-gray-400'
            >Cancelar</Button>
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