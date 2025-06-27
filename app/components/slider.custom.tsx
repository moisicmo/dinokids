import { Range, getTrackBackground } from 'react-range';
import { useState } from 'react';

interface SliderCustomProps {
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  helperText?: string;
}

export const SliderCustom = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  error = false,
  helperText = '',
}: SliderCustomProps) => {
  const [localValues, setLocalValues] = useState<number[]>(value);

  const handleChange = (vals: number[]) => {
    setLocalValues(vals);
    onChange(vals);
  };

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  const primaryColor300 = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-300').trim();

  return (
    <div className="w-full px-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <Range
        values={localValues}
        step={step}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className="h-10 flex w-full"
          >
            <div
              ref={props.ref}
              className="w-full h-2 rounded-md"
              style={{
                background: getTrackBackground({
                  values: localValues,
                  colors: [primaryColor300, primaryColor, primaryColor300],
                  min,
                  max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => {
          const { key, ...restProps } = props;

          return (
            <div
              key={key}
              {...restProps}
              className="h-5 w-5 rounded-full bg-white border border-white shadow-md flex items-center justify-center"
            >
              <div
                className="w-1 h-4"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          );
        }}

      />
      <div className="mt-2 text-sm text-gray-600">
        Rango seleccionado: <strong>{localValues[0]}</strong> a <strong>{localValues[1]}</strong>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
