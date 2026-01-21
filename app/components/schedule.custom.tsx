import { DayOfWeek, type FormAssignmentScheduleModel, type FormScheduleModel } from '@/models';
import React from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';

interface Props {
  schedules: FormScheduleModel[];
  selectedSchedules: FormAssignmentScheduleModel[];
  children?: React.ReactNode;
  scheduleSelect?: (value: string) => void;
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

// Función auxiliar para convertir a Date
const safeToDate = (value: Date | string | null): Date | null => {
  if (!value) return null;
  return new Date(value); // Esto funciona tanto para Date como para string ISO
};

const getOverlapStyle = (dateStart: Date | string | null, dateEnd: Date | string | null, hour: string) => {
  if (!dateStart || !dateEnd) return null;
  
  const start = safeToDate(dateStart);
  const end = safeToDate(dateEnd);
  if (!start || !end) return null;
  
  const [h] = hour.split(':').map(Number);
  const rangeStart = new Date(start);
  rangeStart.setHours(h, 0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setHours(h + 1, 0, 0, 0);

  const overlapStart = start > rangeStart ? start : rangeStart;
  const overlapEnd = end < rangeEnd ? end : rangeEnd;
  if (overlapEnd <= overlapStart) return null;

  const totalMs = rangeEnd.getTime() - rangeStart.getTime();
  const overlapMs = overlapEnd.getTime() - overlapStart.getTime();
  const heightPercent = (overlapMs / totalMs) * 100;

  const eventStartHour = start.getHours();
  const eventEndHour = end.getHours();
  const isStartHour = h === eventStartHour;
  const isEndHour = h === eventEndHour;

  if (isStartHour && isEndHour) {
    const topPercent = ((overlapStart.getTime() - rangeStart.getTime()) / totalMs) * 100;
    return { top: `${topPercent}%`, height: `${heightPercent}%`, bottom: 'auto' };
  } else if (isStartHour) {
    return { bottom: 0, height: `${heightPercent}%`, top: 'auto' };
  } else if (isEndHour) {
    return { top: 0, height: `${heightPercent}%`, bottom: 'auto' };
  } else {
    return { top: 0, bottom: 0, height: '100%' };
  }
};

export const ScheduleCustom: React.FC<Props> = ({ schedules, selectedSchedules, children, scheduleSelect }) => {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<string | undefined>(undefined);

  const getEvent = (dayKey: string, hour: string) =>
    schedules.find(schedule =>
      schedule.day === dayKey &&
      schedule.start && schedule.end &&
      getOverlapStyle(schedule.start, schedule.end, hour) !== null
    );

  // Función para formatear la hora de manera segura
  const formatTime = (dateValue: Date | string | null) => {
    const date = safeToDate(dateValue);
    if (!date) return '';
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false // Para formato 24 horas
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px repeat(6, auto)',
          border: '1px solid #ccc',
        }}
      >
        <div />
        {displayDays.map(([key, label]) => (
          <div key={key} className="text-xs font-bold text-center bg-gray-100 p-1 sm:p-2 md:p-3 whitespace-nowrap">
            {label}
          </div>
        ))}

        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-center bg-amber-50 text-xs">{hour}</div>
            {displayDays.map(([key]) => {
              const event = getEvent(key, hour);
              const overlapStyle = event ? getOverlapStyle(event.start, event.end, hour) : null;
              const isSelected = selectedSchedules?.some(sel => sel.schedule.id === event?.id && sel.day === key);

              return event ? (
                <Popover
                  key={key + hour}
                  open={popoverOpen && selectedEvent == (key + hour)}
                  onOpenChange={(open) => {
                    if (!open) {
                      setPopoverOpen(false);
                      setSelectedEvent(undefined);
                    }
                  }}
                >
                  <PopoverAnchor asChild>
                    <div
                      style={{
                        position: 'relative',
                        height: 40,
                        border: '0.1px solid #ddd',
                        cursor: scheduleSelect ? 'pointer' : 'default',
                        overflow: 'hidden',
                      }}
                      onClick={() => {
                        if (scheduleSelect == null) return;
                        if (event.id != null) {
                          scheduleSelect(event.id);
                        }
                        setSelectedEvent(key + hour);
                        setPopoverOpen(true);
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          backgroundColor: event.color || '#3B82F6',
                          opacity: scheduleSelect? isSelected ? 1 : 0.3 : 1,
                          transition: 'all 0.3s ease',
                          ...overlapStyle!,
                        }}
                        // ¡AHORA SÍ FUNCIONA! Usamos formatTime que convierte strings a Date
                        title={`${event.day} ${formatTime(event.start)} - ${formatTime(event.end)} (Capacidad: ${event.capacity})`}
                      />
                    </div>
                  </PopoverAnchor>

                  <PopoverContent side="top" align="center" className="w-64 z-50">
                    {children || (
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: event.color || '#3B82F6' }}
                          />
                          <h4 className="font-semibold">Horario</h4>
                        </div>
                        <p><strong>Día:</strong> {event.day}</p>
                        <p>
                          <strong>Horario:</strong> {formatTime(event.start)} - {formatTime(event.end)}
                        </p>
                        <p><strong>Capacidad:</strong> {event.capacity}</p>
                        {event.color && (
                          <p className="flex items-center gap-2">
                            <strong>Color:</strong>
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: event.color }}
                            />
                            <span>{event.color}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  key={key + hour}
                  style={{
                    position: 'relative',
                    height: 40,
                    border: '0.1px solid #ddd',
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};