import { ScheduleCustom } from "@/components";
import type { AssignmentRoomModel, RoomModel, ScheduleModel } from "@/models";
import { useState, useMemo } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  room: RoomModel;
}

export const ScheduleView = (props: Props) => {
  const { open, handleClose, room } = props;
  if (!open) return null;

  const [assignmentRoom, setAssignmentRoom] = useState<AssignmentRoomModel | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleModel | null>(null);

  // 📦 Agrupar inscripciones por schedule.id
  const scheduleInscriptions = useMemo(() => {
    const map: Record<string, AssignmentRoomModel[]> = {};
    room.assignmentRooms.forEach(ar => {
      ar.assignmentSchedules.forEach(as => {
        const id = as.schedule.id;
        if (!map[id]) map[id] = [];
        map[id].push(ar);
      });
    });
    return map;
  }, [room.assignmentRooms]);

  // 📦 Datos del horario seleccionado
  const selectedInscriptions = selectedSchedule ? scheduleInscriptions[selectedSchedule.id] || [] : [];
  const enrolled = selectedInscriptions.length;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Horarios</h2>

        <ScheduleCustom
          schedules={room.schedules}
          selectedSchedules={[]}
          scheduleSelect={(val) => {
            const inscription = room.assignmentRooms.find(ar =>
              ar.assignmentSchedules.some(as => as.schedule.id === val)
            );
            const schedule = room.schedules.find(s => s.id === val);
            setSelectedSchedule(schedule ?? null);
            setAssignmentRoom(inscription ?? null);
          }}
        >
          {selectedSchedule && (
            <div className="">
              {/* 📊 Cupo */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{enrolled} / {selectedSchedule.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, (enrolled / selectedSchedule.capacity) * 100)}%` }}
                />
              </div>

              {/* 👥 Estudiantes inscritos */}
              <div>
                <h3 className="font-semibold text-md">Estudiantes inscritos:</h3>
                {enrolled === 0 ? (
                  <p className="text-gray-500 italic">Aún no hay estudiantes inscritos.</p>
                ) : (
                  <ul className="space-y-1">
                    {selectedInscriptions.map((ar, idx) => {
                      const student = ar.inscription.student;
                      return (
                        <li key={idx} className="flex items-center gap-3 rounded-lg bg-gray-50">
                          <div>
                            <p className="font-medium">{student?.user.name} {student?.user.lastName}</p>
                            <p className="text-sm text-gray-600">Código: {student?.code}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </ScheduleCustom>
      </div>
    </div>
  );
};