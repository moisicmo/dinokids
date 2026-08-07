import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  id?: string;
  name: string;
  value: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  mode?: 'date' | 'time' | 'datetime';
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  disabled?: boolean;
}

export const DateTimePickerCustom = memo((props: Props) => {
  const {
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    error = false,
    helperText = '',
    className = '',
    mode = 'datetime',
    minDate,
    maxDate,
    minTime,
    maxTime,
    disabled,
  } = props;

  const inputType = mode === 'date' ? 'date' : mode === 'time' ? 'custom-time' : 'datetime-local';

  const formatValue = () => {
    if (!value) return '';
    if (mode === 'date') return value.toISOString().slice(0, 10);
    if (mode === 'time') return value.toTimeString().slice(0, 5);
    return value.toISOString().slice(0, 16);
  };

  // Funciones para formatear min y max según tipo
  const formatMinMax = (date: Date | undefined, isMin: boolean) => {
    if (!date) return undefined;
    if (mode === 'date') return date.toISOString().slice(0, 10);
    if (mode === 'time') return date.toTimeString().slice(0, 5);
    if (mode === 'datetime') return date.toISOString().slice(0, 16);
    return undefined;
  };

  const min = mode === 'date' ? formatMinMax(minDate, true) :
    mode === 'time' ? formatMinMax(minTime, true) :
      formatMinMax(minDate ?? minTime, true);

  const max = mode === 'date' ? formatMinMax(maxDate, false) :
    mode === 'time' ? formatMinMax(maxTime, false) :
      formatMinMax(maxDate ?? maxTime, false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange?.(null);
      return;
    }

    let result: Date;

    if (mode === 'date') {
      result = new Date(`${raw}T00:00`);
    } else if (mode === 'time') {
      const [hours, minutes] = raw.split(':');
      const now = new Date('1970-01-01T00:00');
      now.setHours(Number(hours), Number(minutes), 0, 0);
      result = now;
    } else {
      result = new Date(raw);
    }

    onChange?.(result);
  };

  // Generar opciones de tiempo en intervalos de 30 minutos
  const generateTimeOptions = () => {
    const options: string[] = [];
    const startHour = minTime ? minTime.getHours() : 0;
    const endHour = maxTime ? maxTime.getHours() : 23;
    const startMinute = minTime ? minTime.getMinutes() : 0;
    const endMinute = maxTime ? maxTime.getMinutes() : 59;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if ((hour === startHour && minute < startMinute) || (hour === endHour && minute > endMinute)) {
          continue;
        }
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        options.push(time);
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="mb-4 w-full">
      {label && (
        <Label htmlFor={id || name} className="block mb-1">
          {label}
        </Label>
      )}
      {mode === 'time' ? (
        <Select
          value={value ? formatValue() : ''}
          onValueChange={(time) => handleChange({ target: { value: time } } as React.ChangeEvent<HTMLSelectElement>)}
          disabled={disabled}
        >
          <SelectTrigger
            id={id || name}
            className={cn("w-full", error && "border-destructive", className)}
          >
            <SelectValue placeholder={placeholder || 'Seleccione una hora'} />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id || name}
          name={name}
          type={inputType}
          value={formatValue()}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          min={min}
          max={max}
          className={cn(error && "border-destructive", className)}
        />
      )}
      {helperText && (
        <p className={cn("text-sm mt-1", error ? "text-destructive" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
});