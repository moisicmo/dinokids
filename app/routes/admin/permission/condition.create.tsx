import { Trash2 } from 'lucide-react';
import { Button, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { formConditionValidations, type FormConditionModel } from '@/models';
import { useEffect, useState } from 'react';

interface Props {
  conditions: FormConditionModel[];
  onChange: (updated: FormConditionModel[]) => void;
  formSubmitted: boolean;
}

export const ConditionCreate = ({ conditions, onChange, formSubmitted }: Props) => {
  const [errors, setErrors] = useState<(Partial<Record<keyof FormConditionModel, string>> | null)[]>([]);

  // 🔹 Opciones predefinidas para los operadores
const operatorOptions: ValueSelect[] = [
  { id: 'equals', value: 'Igual a' },
  { id: 'not_equals', value: 'Diferente' },
  { id: 'in', value: 'Incluido en' },
  { id: 'not_in', value: 'No incluido en' },
  { id: 'between', value: 'Entre' },
  { id: 'greater_than', value: 'Mayor que' },
  { id: 'less_than', value: 'Menor que' },
];

  const fieldOptions: ValueSelect[] = [
    { id: 'id', value: 'id' },
    { id: 'branchId', value: 'Sucursal' },
    { id: 'roleId', value: 'Rol' },
    { id: 'userId', value: 'Usuario actual' },
    { id: 'year', value: 'Año actual' },
    { id: 'hour', value: 'Hora actual' },
    { id: 'dayOfWeek', value: 'Día de la semana' },
  ];
  const getValuePlaceholder = (operator: string) => {
    switch (operator) {
      case 'eq':
        return 'Ej: 5 o "{{user.branchId}}"';
      case 'ne':
        return 'Ej: diferente a 10';
      case 'in':
        return 'Ej: [1,2,3] o ["A","B","C"]';
      case 'nin':
        return 'Ej: valores que NO estén en [8,9]';
      case 'between':
        return 'Ej: [8,20] (rango)';
      case 'gt':
        return 'Ej: 18 (mayor que)';
      case 'lt':
        return 'Ej: 10 (menor que)';
      default:
        return 'Ej: valor o variable dinámica';
    }
  };


  // 🔹 Al agregar una nueva condición
  const handleAdd = () => {
    const newCondition: FormConditionModel = {
      field: '',
      operator: '',
      value: '',
    };
    onChange([...conditions, newCondition]);
  };

  // 🔹 Al eliminar una condición
  const handleRemove = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    onChange(updated);
  };

  // 🔹 Cuando cambia un campo dentro de una condición
  const handleFieldChange = (index: number, field: keyof FormConditionModel, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // 🔹 Valida dinámicamente todas las condiciones
  useEffect(() => {
    if (!formSubmitted) {
      setErrors([]);
      return;
    }

    const newErrors = conditions.map((condition) => {
      const error: Partial<Record<keyof FormConditionModel, string>> = {};

      for (const key in formConditionValidations) {
        const [validateFn, message] = formConditionValidations[key as keyof FormConditionModel];
        if (!validateFn(condition[key as keyof FormConditionModel])) {
          error[key as keyof FormConditionModel] = message;
        }
      }

      return Object.keys(error).length > 0 ? error : null;
    });

    setErrors(newErrors);
  }, [conditions, formSubmitted]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Condiciones</h3>
        <Button type="button" onClick={handleAdd}>
          Agregar Condición
        </Button>
      </div>

      {conditions.length === 0 && (
        <p className="text-sm text-gray-500">No hay condiciones agregadas (opcional).</p>
      )}

      <div className="space-y-3 overflow-y-auto max-h-[650vh] pr-3 pt-2 pb-4">

        {conditions.map((condition, idx) => (
          <div key={idx} className="border p-4 rounded-md relative bg-gray-50">
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition cursor-pointer z-10"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SelectCustom
                label="Campo"
                options={fieldOptions}
                selected={
                  condition.field
                    ? fieldOptions.find((opt) => opt.id === condition.field) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'field', value.id);
                  }
                }}
                error={!!errors[idx]?.field && formSubmitted}
                helperText={formSubmitted ? errors[idx]?.field ?? '' : 'Selecciona el campo sobre el cual aplicar la condición'}
              />
              <SelectCustom
                label="Operador"
                options={operatorOptions}
                selected={
                  condition.operator
                    ? operatorOptions.find((opt) => opt.id === condition.operator) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'operator', value.id);
                  }
                }}
                error={!!errors[idx]?.operator && formSubmitted}
                helperText={formSubmitted ? errors[idx]?.operator ?? '' : ''}
              />

              <InputCustom
                name={`value-${idx}`}
                label="Valor"
                placeholder={getValuePlaceholder(condition.operator)}
                value={condition.value}
                onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                error={!!errors[idx]?.value && formSubmitted}
                helperText={
                  formSubmitted
                    ? errors[idx]?.value ?? ''
                    : 'Puedes usar valores fijos o variables (ej: {{user.branchId}})'
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
