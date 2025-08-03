import { DayOfWeek, type FormAssignmentScheduleModel, type FormScheduleModel } from '@/models';
import React from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';

interface Props {
  schedules: FormScheduleModel[];
  selectedSchedules: FormAssignmentScheduleModel[];
  children?: React.ReactNode;
  scheduleSelect: (value:string)=> void;
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
      getOverlapStyle(new Date(schedule.start), new Date(schedule.end), hour) !== null
    );

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
              const overlapStyle = event ? getOverlapStyle(new Date(event.start!), new Date(event.end!), hour) : null;
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
                        cursor: 'pointer',
                        overflow: 'hidden',
                      }}
                      onClick={() => {
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
                          backgroundColor: isSelected ? primaryColor : primaryColor200,
                          transition: 'height 0.3s ease',
                          ...overlapStyle!,
                        }}
                      />
                    </div>
                  </PopoverAnchor>

                  <PopoverContent side="top" align="center" className="w-64 z-50">
                    {children}
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