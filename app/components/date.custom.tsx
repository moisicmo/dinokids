import { memo } from "react";

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
  mode?: 'date' | 'time' | 'datetime'; // NUEVA PROP
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
    mode = 'datetime', // por defecto: datetime-local
  } = props;

  const inputType = mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local';

  const baseInputClass = `
    mt-1 block w-full rounded-md border px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-primary
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;

  // Convert Date → string para mostrarlo en el input
  const formatValue = () => {
    if (!value) return '';
    if (mode === 'date') return value.toISOString().slice(0, 10); // yyyy-mm-dd
    if (mode === 'time') return value.toTimeString().slice(0, 5); // HH:MM
    return value.toISOString().slice(0, 16); // datetime-local
  };

  // Convert string → Date
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange?.(null);
      return;
    }

    let result: Date;

    if (mode === 'date') {
      result = new Date(`${raw}T00:00`);
    } else if (mode === 'time') {
      // Componer con fecha base
      const [hours, minutes] = raw.split(':');
      const now = new Date();
      now.setHours(Number(hours), Number(minutes), 0, 0);
      result = now;
    } else {
      result = new Date(raw);
    }

    onChange?.(result);
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={inputType}
        value={formatValue()}
        onChange={handleChange}
        placeholder={placeholder}
        className={baseInputClass}
        autoComplete="off"
      />
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
