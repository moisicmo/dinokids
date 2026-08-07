


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputPhonesCustomProps {
  name: string;
  value: string[]; // Lista de teléfonos
  onChange: (phones: string[]) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const InputPhonesCustom = ({
  name,
  value,
  onChange,
  label,
  error,
  helperText,
}: InputPhonesCustomProps) => {
  const [phones, setPhones] = useState<string[]>(value);

  const handleChange = (index: number, newValue: string) => {
    const updated = [...phones];
    updated[index] = newValue;
    setPhones(updated);
    onChange(updated);
  };

  const handleAddPhone = () => {
    const updated = [...phones, ''];
    setPhones(updated);
    onChange(updated);
  };

  const handleRemovePhone = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    setPhones(updated);
    onChange(updated);
  };

  return (
    <div className="mb-2 w-full">
      {label && <Label className="mb-1">{label}</Label>}

      {phones.map((phone, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <Input
            type="text"
            name={`${name}[${index}]`}
            value={phone}
            onChange={(e) => handleChange(index, e.target.value)}
            className={cn(error && "border-destructive")}
            placeholder="Ingrese número"
          />
          <button
            type="button"
            onClick={() => handleRemovePhone(index)}
            className="text-destructive hover:text-destructive/80 text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddPhone}
        className="text-primary hover:text-primary/80 text-sm mt-1"
      >
        + Agregar teléfono
      </button>

      {helperText && (
        <p className={cn("text-sm mt-1", error ? "text-destructive" : "text-muted-foreground")}>{helperText}</p>
      )}
    </div>
  );
};
