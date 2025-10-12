import { InputCustom, InputPhonesCustom, SelectCustom, ValueSelect } from "@/components";
import { useCityStore } from "@/hooks";
import type { FormUserModel } from "@/models";
import { useEffect } from "react";
interface UserFormFieldsProps {
  user: FormUserModel;
  userValid: any;
  formSubmitted: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValueChange: (name: string, value: any) => void;
}

export const UserFormFields = ({
  user,
  userValid,
  formSubmitted,
  onInputChange,
  onValueChange,
}: UserFormFieldsProps) => {

  const { dataCity, getCityes } = useCityStore();

  useEffect(() => {
    getCityes();
  }, []);
  return (
    <>
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
        label="Correo electrónico"
        onChange={onInputChange}
        error={!!userValid?.emailValid && formSubmitted}
        helperText={formSubmitted ? userValid?.emailValid : ''}
      />
      {
        user.phone &&
        <InputPhonesCustom
          name="user.phone"
          value={user.phone}
          onChange={(phones) => onValueChange('user.phone', phones)}
          label="Teléfonos"
          error={!!userValid?.phoneValid && formSubmitted}
          helperText={formSubmitted ? userValid?.phoneValid : ''}
        />
      }
      {
        user.address &&
        <>
          <SelectCustom
            label="Ciudad"
            options={
              dataCity.data.map((city) => new ValueSelect(city.id, city.name))
            }
            selected={
              user.address.city
                ? new ValueSelect(user.address.city.id, user.address.city.name)
                : null
            }
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const city = dataCity.data.find((c) => c.id === value.id);
                if (city) {
                  onValueChange('user.address.city', city);
                }
              }
            }}
            error={!!userValid?.addressValid?.cityValid && formSubmitted}
            helperText={formSubmitted ? userValid?.addressValid?.cityValid : ''}
          />
          <InputCustom
            name="user.address.zone"
            value={user.address.zone}
            label="Zona"
            onChange={onInputChange}
            error={!!userValid?.addressValid?.zoneValid && formSubmitted}
            helperText={formSubmitted ? userValid?.addressValid?.zoneValid : ''}
          />
          <InputCustom
            name="user.address.detail"
            value={user.address.detail}
            label="Direccion"
            onChange={onInputChange}
            error={!!userValid?.addressValid?.detailValid && formSubmitted}
            helperText={formSubmitted ? userValid?.addressValid?.detailValid : ''}
          />
        </>
      }
      <InputCustom
        name="user.numberCard"
        value={user.numberCard}
        label="Número tarjeta (opcional)"
        onChange={onInputChange}
      />

    </>
  );
};
