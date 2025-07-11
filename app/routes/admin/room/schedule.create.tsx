import { Trash2 } from 'lucide-react';
import { ButtonCustom, DateTimePickerCustom, InputCustom, ScheduleCustom, SelectCustom, type ValueSelect } from '@/components';
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
    value: Date | DayOfWeek | String | null,
  ) => {
    const updated = [...schedules];
    updated[index] = {
      ...updated[index],
      [field]: value
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
          <ButtonCustom
            onClick={handleAdd}
            text="Agregar Horario"
          />
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

              <SelectCustom
                label="Día"
                options={dayOptions}
                selected={
                  schedule.day
                    ? dayOptions.find((opt) => opt.id === schedule.day) ?? null
                    : null
                }
                // selected={dayOptions.filter(opt => schedule.day.includes(opt.id as DayOfWeek))}
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'day', value.id);
                  }
                  // if (Array.isArray(values)) {
                  //   const selectedDays = values.map(v => v.id as DayOfWeek);
                  //   handleFieldChange(idx, 'day', selectedDays);
                  // }
                }}
                error={formSubmitted && schedule.day === null}
                helperText={formSubmitted && schedule.day === null ? 'Campo requerido' : ''}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DateTimePickerCustom
                  name={`start-${idx}`}
                  label="Hora inicio"
                  mode="time"
                  minTime={new Date('1970-01-01T08:00')}
                  maxTime={new Date('1970-01-01T20:00')}
                  value={schedule.start}
                  onChange={(val) => handleFieldChange(idx, 'start', val)}
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
                  onChange={(val) => handleFieldChange(idx, 'end', val)}
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
          selectedSchedules={[]} // ✅ Agregado para cumplir con Props
          onEventClick={(e: any) => alert(`Clic en evento: ${e.day} de ${e.start} a ${e.end}`)}
        />

      </div>
    </div>
  );
};
