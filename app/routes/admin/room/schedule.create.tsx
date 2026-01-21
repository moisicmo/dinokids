import { Trash2 } from 'lucide-react';
import { Button, ColorPickerCustom, DateTimePickerCustom, InputCustom, ScheduleCustom, SelectCustom, type ValueSelect } from '@/components';
import { DayOfWeek, type FormScheduleModel } from '@/models';

interface Props {
  schedules: FormScheduleModel[];
  onChange: (updated: FormScheduleModel[]) => void;
  formSubmitted: boolean;
  schedulesValid?: string | null;
}

export const ScheduleForm = ({
  schedules,
  onChange,
  formSubmitted,
  schedulesValid,
}: Props) => {

  const handleAdd = () => {
    const newSchedule: FormScheduleModel = {
      day: null,
      start: null,
      end: null,
      capacity: 0,
      color: '#3B82F6', // Color por defecto (azul)
    };
    onChange([...schedules, newSchedule]);
  };

  const handleRemove = (index: number) => {
    if (schedules.length == 1) return;
    const updated = schedules.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (
    index: number,
    field: keyof FormScheduleModel,
    value: any,
  ) => {
    const updated = [...schedules];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  const updateSchedule = (index: number, start: Date | null, end: Date | null) => {
    const updated = [...schedules];
    updated[index] = {
      ...updated[index],
      start,
      end,
    };
    onChange(updated);
  };

  const dayOptions: ValueSelect[] = Object.entries(DayOfWeek).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Formulario de horarios */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Horarios:</h2>
          <Button onClick={handleAdd}>
            Agregar Horario
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-2">
          {schedules.map((schedule, idx) => (
            <div key={idx} className="border p-4 rounded-md relative">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 text-error w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition cursor-pointer z-10"
              >
                <Trash2 size={18} />
              </button>

              {/* Indicador visual del color */}
              <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: schedule.color }}
                />
                <span className="text-xs text-gray-500">
                  Horario {idx + 1}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <SelectCustom
                  label="Día"
                  options={dayOptions}
                  selected={
                    schedule.day
                      ? dayOptions.find((opt) => opt.id === schedule.day) ?? null
                      : null
                  }
                  onSelect={(value) => {
                    if (value && !Array.isArray(value)) {
                      handleFieldChange(idx, 'day', value.id);
                    }
                  }}
                  error={formSubmitted && schedule.day === null}
                  helperText={formSubmitted && schedule.day === null ? 'Campo requerido' : ''}
                />

                <ColorPickerCustom
                  label="Color del horario"
                  value={schedule.color || '#3B82F6'}
                  onChange={(color) => handleFieldChange(idx, 'color', color)}
                  error={formSubmitted && !schedule.color}
                  helperText={formSubmitted && !schedule.color ? 'Selecciona un color' : ''}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DateTimePickerCustom
                    name={`start-${idx}`}
                    label="Hora inicio"
                    mode="time"
                    minTime={new Date('1970-01-01T08:00')}
                    maxTime={new Date('1970-01-01T20:00')}
                    value={schedule.start}
                    onChange={(val) => {
                      if (val && schedule.end && val > schedule.end) {
                        updateSchedule(idx, val, null);
                      } else {
                        updateSchedule(idx, val, schedule.end);
                      }
                    }}
                    error={formSubmitted && schedule.start == null}
                    helperText={formSubmitted && schedule.start === null ? 'Campo requerido' : ''}
                  />
                  <DateTimePickerCustom
                    name={`end-${idx}`}
                    label="Hora Fin"
                    mode="time"
                    minTime={new Date('1970-01-01T08:00')}
                    maxTime={new Date('1970-01-01T20:00')}
                    value={schedule.end}
                    onChange={(val) => {
                      if (val && schedule.start && val < schedule.start) {
                        updateSchedule(idx, null, val);
                      } else {
                        updateSchedule(idx, schedule.start, val);
                      }
                    }}
                    error={formSubmitted && schedule.end == null}
                    helperText={formSubmitted && schedule.end === null ? 'Campo requerido' : ''}
                  />
                </div>
                
                <InputCustom
                  name={`capacity-${idx}`}
                  value={schedule.capacity}
                  label="Capacidad"
                  onChange={(val) => handleFieldChange(idx, 'capacity', val.target.value)}
                  error={formSubmitted && schedule.capacity == 0}
                  helperText={formSubmitted && schedule.capacity === 0 ? 'Campo requerido' : ''}
                />
              </div>
            </div>
          ))}
        </div>

        {formSubmitted && schedulesValid && (
          <p className="text-sm text-red-600 font-medium">{schedulesValid}</p>
        )}
      </div>

      {/* Vista del horario */}
      <div className="flex-1">
        <ScheduleCustom
          schedules={schedules}
          selectedSchedules={[]}
        />
      </div>
    </div>
  );
};