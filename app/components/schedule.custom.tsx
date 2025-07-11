import { DayOfWeek, type FormAssignmentScheduleModel, type FormScheduleModel } from '@/models';
import React from 'react';

interface Props {
  schedules: FormScheduleModel[];
  selectedSchedules: FormAssignmentScheduleModel[];
  onEventClick?: (event: { id?: string; day: string; start: string; end: string }) => void;
}

const dayEnumMap: Record<string, DayOfWeek> = {
  MONDAY: DayOfWeek.MONDAY,
  TUESDAY: DayOfWeek.TUESDAY,
  WEDNESDAY: DayOfWeek.WEDNESDAY,
  THURSDAY: DayOfWeek.THURSDAY,
  FRIDAY: DayOfWeek.FRIDAY,
  SATURDAY: DayOfWeek.SATURDAY,
};

const displayDays = Object.entries(dayEnumMap);

const hours = Array.from({ length: 13 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

// Función para calcular porcentaje de solapamiento y estilo de relleno
const getOverlapStyle = (dateStart: Date, dateEnd: Date, hour: string) => {
  const [h] = hour.split(':').map(Number);
  const rangeStart = new Date(dateStart);
  rangeStart.setHours(h, 0, 0, 0);

  const rangeEnd = new Date(rangeStart);
  rangeEnd.setHours(h + 1, 0, 0, 0);

  const overlapStart = dateStart > rangeStart ? dateStart : rangeStart;
  const overlapEnd = dateEnd < rangeEnd ? dateEnd : rangeEnd;

  if (overlapEnd <= overlapStart) return null;

  const totalMs = rangeEnd.getTime() - rangeStart.getTime();
  const overlapMs = overlapEnd.getTime() - overlapStart.getTime();

  const heightPercent = (overlapMs / totalMs) * 100;

  const eventStartHour = dateStart.getHours();
  const eventEndHour = dateEnd.getHours();

  const isStartHour = h === eventStartHour;
  const isEndHour = h === eventEndHour;

  if (isStartHour && isEndHour) {
    // Empieza y termina en esta hora, usamos top y height
    const topPercent = ((overlapStart.getTime() - rangeStart.getTime()) / totalMs) * 100;
    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
      bottom: 'auto',
    };
  } else if (isStartHour) {
    // Empieza en esta hora, termina después
    return {
      bottom: 0,
      height: `${heightPercent}%`,
      top: 'auto',
    };
  } else if (isEndHour) {
    // Termina en esta hora, empieza antes
    return {
      top: 0,
      height: `${heightPercent}%`,
      bottom: 'auto',
    };
  } else {
    // Cubre toda la hora
    return {
      top: 0,
      bottom: 0,
      height: '100%',
    };
  }
};

export const ScheduleCustom: React.FC<Props> = ({ schedules, selectedSchedules, onEventClick }) => {


const getEvent = (dayKey: string, hour: string) => {
  return schedules.find(schedule =>
    schedule.day === dayKey &&
    schedule.start && schedule.end &&
    (() => {
      const overlapStyle = getOverlapStyle(new Date(schedule.start), new Date(schedule.end), hour);
      return overlapStyle !== null;
    })()
  );
};



  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  const primaryColor200 = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-200').trim();

  return (
    <div className="w-full overflow-x-auto">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px repeat(6, auto)',
          border: '1px solid #ccc',
        }}
      >
        <div></div>
        {displayDays.map(([key, label]) => (
          <div
            key={key}
            className="text-xs font-bold text-center bg-gray-100 p-1 sm:p-2 md:p-3 whitespace-nowrap"
          >
            {label}
          </div>
        ))}

        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className=' text-center bg-amber-50 text-xs'>
              {hour}
            </div>
            {displayDays.map(([key]) => {
              const event = getEvent(key, hour);
              const overlapStyle = event ? getOverlapStyle(new Date(event.start!), new Date(event.end!), hour) : null;
              const isSelected = selectedSchedules?.some(sel => sel.schedule.id === event?.id && sel.day === key);

              return (
                <div
                  key={key + hour}
                  style={{
                    position: 'relative',
                    height: 40,
                    border: '0.1px solid #ddd',
                    cursor: event ? 'pointer' : 'default',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    if (event && onEventClick && event.start && event.end) {
                      const start = new Date(event.start).toTimeString().slice(0, 5);
                      const end = new Date(event.end).toTimeString().slice(0, 5);
                      onEventClick({
                        id: event.id ?? undefined, // Devuelve el id si existe
                        day: key,
                        start,
                        end,
                      });
                    }
                  }}
                >
                  {event && overlapStyle && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        backgroundColor: isSelected ? primaryColor : primaryColor200,
                        transition: 'height 0.3s ease',
                        ...overlapStyle,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
