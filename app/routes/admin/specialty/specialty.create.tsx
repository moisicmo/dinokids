import { useEffect, useState, type FormEvent } from 'react';
import { useSpecialtyStore, useForm, useBranchStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom } from '@/components';
import type { SpecialtyModel, FormSpecialtyModel, FormSpecialtyValidations } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: SpecialtyModel | null;
}

const formFields: FormSpecialtyModel = {
  branch: null,
  name: '',
  numberSessions: 0,
  estimatedSessionCost: 0,
};

const formValidations: FormSpecialtyValidations = {
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  numberSessions: [(value) => value.length > 0, 'Debe ingresar el número de sesiones'],
  estimatedSessionCost: [(value) => value.length > 0, 'Debe ingresar el costo estimado por sesión'],
};

export const SpecialtyCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createSpecialty, updateSpecialty } = useSpecialtyStore();
  const { dataBranch, getBranches } = useBranchStore();

  const {
    branch,
    name,
    numberSessions,
    estimatedSessionCost,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    branchValid,
    nameValid,
    numberSessionsValid,
    estimatedSessionCostValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createSpecialty({
        branchId: branch.id,
        name: name.trim(),
        numberSessions: parseInt(numberSessions),
        estimatedSessionCost: parseInt(estimatedSessionCost),
      });
    } else {
      await updateSpecialty(item.id, {
        branchId: branch.id,
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

  useEffect(() => {
    getBranches();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <SelectCustom
            label="Sucursal"
            options={dataBranch.data?.map((branch) => ({ id: branch.id, value: branch.name })) ?? []}
            selected={branch ? { id: branch.id, value: branch.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const select = dataBranch.data?.find((r) => r.id === value.id);
                onValueChange('branch', select);
              }
            }}
            error={!!branchValid && formSubmitted}
            helperText={formSubmitted ? branchValid : ''}
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