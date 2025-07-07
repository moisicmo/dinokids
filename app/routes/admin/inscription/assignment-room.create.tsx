import { Trash2 } from 'lucide-react';
import { ButtonCustom, DateTimePickerCustom, ScheduleCustom, SelectCustom } from '@/components';
import { DayOfWeek, type FormAssignmentRoomModel } from '@/models';
import { useEnums, useRoomStore } from '@/hooks';
import { useEffect, useState } from 'react';

interface Props {
  assignmentRooms: FormAssignmentRoomModel[];
  onChange: (updated: FormAssignmentRoomModel[]) => void;
  formSubmitted: boolean;
  assignmentRoomsValid?: string | null;
}

export const AssignmentRoomForm = (props: Props) => {
  const {
    assignmentRooms,
    onChange,
    formSubmitted,
    assignmentRoomsValid,
  } = props;

  const { dataRoom, getRooms } = useRoomStore();
  const { getDay } = useEnums();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newAssignmentRoom: FormAssignmentRoomModel = {
      room: null,
      start: null,
      assignmentSchedules: [],
    };
    onChange([...assignmentRooms, newAssignmentRoom]);
  };

  const handleRemove = (index: number) => {
    if (assignmentRooms.length === 1) return;
    const updated = assignmentRooms.filter((_, i) => i !== index);
    onChange(updated);
    if (activeIndex === index) setActiveIndex(null);
  };

  const handleFieldChange = (
    index: number,
    field: keyof FormAssignmentRoomModel,
    value: any
  ) => {
    const updated = [...assignmentRooms];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    console.log(updated)
    onChange(updated);
  };

  useEffect(() => {
    getRooms();
  }, [])


  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Formulario de horarios */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Asignaciones:</h2>
          <ButtonCustom onClick={handleAdd} text="Agregar asignación" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-2">
          {assignmentRooms.map((assignmentRoom, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div key={idx} className="border rounded-md overflow-hidden">
                {/* Header clickable */}
                <div
                  className="flex justify-between items-center px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                >
                  <span className="font-medium">
                    Asignación {idx + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-error w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition cursor-pointer z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                </div>
                {/* Cuerpo colapsable */}
                <div
                  className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] p-4' : 'max-h-0 p-0'
                    } overflow-hidden`}
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <SelectCustom
                        label="Aula"
                        options={
                          dataRoom.data.map((room) => ({
                            id: room.id,
                            value: room.name,
                          }))
                        }
                        selected={
                          assignmentRoom.room
                            ? {
                              id: assignmentRoom.room.id,
                              value: assignmentRoom.room.name,
                            }
                            : null
                        }
                        onSelect={(value) => {
                          if (value && !Array.isArray(value)) {
                            const selectedRoom = dataRoom.data?.find((r) => r.id === value.id) ?? null;
                            const updatedAssignmentRoom = {
                              room: selectedRoom,
                              start: null,
                              assignmentSchedules: [],
                            };
                            const updated = [...assignmentRooms];
                            updated[idx] = updatedAssignmentRoom;
                            onChange(updated);
                          }
                        }}
                        error={formSubmitted && !assignmentRoom.room}
                        helperText={
                          formSubmitted && !assignmentRoom.room ? 'Campo requerido' : ''
                        }
                      />
                      <DateTimePickerCustom
                        name="start"
                        label="Inicio de clases"
                        mode="date"
                        value={assignmentRoom.start}
                        onChange={(val) => handleFieldChange(idx, 'start', val)}
                        error={formSubmitted && !assignmentRoom.start}
                        helperText={
                          formSubmitted && !assignmentRoom.start
                            ? 'Campo requerido'
                            : ''
                        }
                      />
                      {formSubmitted && assignmentRoom.assignmentSchedules.length === 0 && (
                        <p className="text-sm text-red-600 font-medium">
                          Debes seleccionar al menos un horario en el calendario
                        </p>
                      )}

                      <ul className="text-sm list-disc list-inside text-gray-600 space-y-1">
                        {assignmentRoom.assignmentSchedules.map((as) => {
                          const schedule = assignmentRoom.room?.schedules?.find(s => s.id === as.schedule.id);
                          console.log(schedule)
                          const start = schedule?.start ? new Date(schedule.start).toTimeString().slice(0, 5) : '??';
                          const end = schedule?.end ? new Date(schedule.end).toTimeString().slice(0, 5) : '??';

                          return (
                            <li key={`${as.schedule.id}-${as.day}`}>
                              {getDay(as.day)} – {start} a {end}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {/* Calendario */}
                    <div className={`flex-1 border ${formSubmitted && assignmentRoom.assignmentSchedules.length === 0 ? 'border-red-500' : 'border-transparent'}`}>
                      <ScheduleCustom
                        schedules={assignmentRoom.room?.schedules ?? []}
                        selectedSchedules={assignmentRoom.assignmentSchedules ?? []}
                        onEventClick={(e: any) => {
                          const { id: scheduleId, day } = e;
                          if (!scheduleId || !day) return;

                          // Buscar el schedule completo desde room.schedules
                          const schedule = assignmentRoom.room?.schedules?.find((s) => s.id === scheduleId);
                          if (!schedule) return;

                          const existing = assignmentRoom.assignmentSchedules.find(
                            (s) => s.schedule.id === scheduleId && s.day === day
                          );

                          const updatedAssignmentSchedules = existing
                            ? assignmentRoom.assignmentSchedules.filter(
                              (s) => !(s.schedule.id === scheduleId && s.day === day)
                            )
                            : [...assignmentRoom.assignmentSchedules, { schedule, day }];

                          handleFieldChange(idx, 'assignmentSchedules', updatedAssignmentSchedules);
                        }}
                      />

                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
        {formSubmitted && assignmentRoomsValid && (
          <p className="text-sm text-red-600 font-medium">
            {assignmentRoomsValid}
          </p>
        )}
      </div>
    </div>
  );
};
