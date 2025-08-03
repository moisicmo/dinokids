import { useEffect, useState, type FormEvent } from 'react';
import { useCityStore, useForm } from '@/hooks';
import { Button, InputCustom, InputPhonesCustom, SelectCustom, ValueSelect } from '@/components';
import { formBranchFields, formBranchValidations, type BranchModel, type BranchRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: BranchModel | null;
  onCreate: (body: BranchRequest) => void;
  onUpdate: (id: string, body: BranchRequest) => void;
}

export const BranchCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    name,
    phone,
    address,
    onInputChange,
    onValueChange,
    onResetForm,
    isFormValid,
    nameValid,
    phoneValid,
    addressValid,
  } = useForm(item ?? formBranchFields, formBranchValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const { dataCity, getCityes } = useCityStore();
  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        phone,
        cityId: address.city.id,
        zone: address.zone.trim(),
        detail: address.detail.trim(),
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        phone,
        cityId: address.city.id,
        zone: address.zone.trim(),
        detail: address.detail.trim(),
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

  useEffect(() => {
    getCityes();
  }, []);

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
          <InputPhonesCustom
            name="phone"
            value={phone}
            onChange={(phones) => onValueChange('phone', phones)}
            label="Teléfonos"
            error={!!phoneValid && formSubmitted}
            helperText={formSubmitted ? phoneValid : ''}
          />
          <SelectCustom
            label="Ciudad"
            options={
              dataCity.data.map((city) => new ValueSelect(city.id, city.name))
            }
            selected={
              address.city
                ? new ValueSelect(address.city.id, address.city.name)
                : null
            }
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const city = dataCity.data.find((c) => c.id === value.id);
                if (city) {
                  onValueChange('address.city', city);
                }
              }
            }}
            error={!!addressValid?.cityValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.cityValid : ''}
          />
          <InputCustom
            name="address.zone"
            value={address.zone}
            label="Zona"
            onChange={onInputChange}
            error={!!addressValid?.zoneValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.zoneValid : ''}
          />
          <InputCustom
            name="address.detail"
            value={address.detail}
            label="Direccion"
            onChange={onInputChange}
            error={!!addressValid?.detailValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.detailValid : ''}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
            >Cancelar</Button>
            <Button
              type='submit'
              color='bg-gray-400'
            >{item ? 'Editar' : 'Crear'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};