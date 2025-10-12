import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAttendanceStore, useBranchStore, useForm } from "@/hooks";
import { formAttendanceFields, formAttendanceValidations } from "@/models";
import { InputCustom, SelectCustom } from "@/components";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  GraduationCap,
  FileWarning,
  Clock,
  BookOpen,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AttendanceView() {
  const [countdown, setCountdown] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dataAttendance, setAttendance, clearData } = useAttendanceStore();
  const { dataBranch, getBranches } = useBranchStore();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    branch,
    numberCard,
    onInputChange,
    isFormValid,
    onValueChange,
    branchValid,
    numberCardValid,
  } = useForm(formAttendanceFields, formAttendanceValidations);

  // 🟩 NUEVO: estado local para recordar el branch seleccionado
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  // Mantener el input enfocado y cargar sucursales
  useEffect(() => {
    getBranches();
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 500);
    return () => clearInterval(focusInterval);
  }, []);

  // 🟦 Cuando se cargan las sucursales
  useEffect(() => {
    if (dataBranch?.data?.length === 1) {
      // Si solo hay una sucursal, seleccionarla automáticamente
      const defaultBranch = dataBranch.data[0];
      setSelectedBranch(defaultBranch);
      onValueChange("branch", defaultBranch);
    } else if (selectedBranch) {
      // Si ya se había elegido antes, mantenerla
      onValueChange("branch", selectedBranch);
    }
  }, [dataBranch]);

  useEffect(() => {
    if (numberCard.length == 10) {
      findStudent(numberCard);
    }
  }, [numberCard]);

  const findStudent = async (rfid: string) => {
    setFormSubmitted(true);
    if (!isFormValid) return;

    await setAttendance({
      branchId: branch?.id!,
      numberCard: rfid,
    });

    // 🔹 Solo limpiar el número de tarjeta, no el branch
    onValueChange("numberCard", "");
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearData();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🔹 Calcular métricas si existe data
  const student = dataAttendance?.user?.student;
  const allSessions =
    student?.inscriptions.flatMap((inscription) =>
      inscription.assignmentRooms.flatMap((room) =>
        room.assignmentSchedules.flatMap((schedule) =>
          Array.isArray(schedule.sessions)
            ? schedule.sessions
            : schedule.sessions
              ? [schedule.sessions]
              : [] // por si viene null
        )
      )
    ) ?? [];


  const sessionsPresent = allSessions.filter((s) => s.status === "PRESENT").length;
  const sessionsJustified = allSessions.filter((s) => s.status === "JUSTIFIED").length;
  const sessionsAbsent = allSessions.filter((s) => s.status === "ABSENT").length;
  const sessionsPending = allSessions.filter((s) => s.status === "PENDING").length;

  const totalBalance =
    student?.inscriptions
      .flatMap((i) => i.debts)
      .reduce((sum, d) => sum + d.remainingBalance, 0) ?? 0;
  const totalMonthBalance =
    student?.inscriptions
      .flatMap((i) => i.prices)
      .filter((d) => d.active)
      .reduce((sum, d) => sum + d.monthPrice, 0) ?? 0;


  return (
    <div className="w-full p-4 md:p-6 flex flex-col">
      {/* Input invisible para lector RFID */}
      <SelectCustom
        label="Sucursal"
        options={dataBranch.data?.map((branch) => ({ id: branch.id, value: branch.name })) ?? []}
        selected={branch ? { id: branch.id, value: branch.name } : null}
        onSelect={(value) => {
          if (value && !Array.isArray(value)) {
            const select = dataBranch.data?.find((r) => r.id === value.id);
            setSelectedBranch(select); // ✅ guardar en estado local
            onValueChange("branch", select);
          }
        }}
        error={!!branchValid && formSubmitted}
        helperText={formSubmitted ? branchValid : ""}
      />
      <div className="absolute opacity-0 pointer-events-none">
        <InputCustom
          name="numberCard"
          ref={inputRef}
          value={numberCard}
          label="Número de tarjeta"
          onChange={onInputChange}
          error={!!numberCardValid && formSubmitted}
          helperText={formSubmitted ? numberCardValid : ""}
        />

      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-medium">
          Registro de Asistencia {numberCard}
        </h2>
      </div>

      {/* 🟦 Vista: Esperando lectura */}
      {!dataAttendance ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-60 h-60 border-4 border-dashed border-primary rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-primary font-semibold text-lg">
                Pase su tarjeta
              </span>
            </div>
          </div>
        </div>
      ) : (
        // 🟩 Vista: Datos del estudiante
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300">
          {/* Niño */}
          <Card className="flex flex-col items-center justify-center h-56">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-xl mb-2" />
              <p className="font-semibold text-tertiary">Foto del Niño</p>
              <p className="text-tertiary font-semibold mt-2">
                {dataAttendance.user.name} {dataAttendance.user.lastName}
              </p>
            </CardContent>
          </Card>

          {/* Tutor */}
          <Card className="flex flex-col items-center justify-center h-56">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-xl mb-2" />
              <p className="font-semibold text-tertiary">Foto del Tutor</p>
              <p className="text-tertiary font-semibold mt-2">
                {student?.tutors[0]?.user.name} {student?.tutors[0]?.user.lastName}
              </p>
            </CardContent>
          </Card>

          {/* Inscripciones */}
          {student?.inscriptions.map((inscription) =>
            inscription.assignmentRooms.map((assignmentRoom) => (
              <Card
                key={assignmentRoom.id}
                className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="space-y-2 text-sm md:text-base">
                  {/* Psicopedagoga o profesor */}
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">
                      Nombre de la Psicopedagoga
                    </p>
                    <p className="text-gray-700">
                      {assignmentRoom.room.teacher.user.name}{" "}
                      {assignmentRoom.room.teacher.user.lastName}
                    </p>
                  </div>

                  {/* Sala */}
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">
                      Nombre de la sala
                    </p>
                    <p className="text-gray-700">{assignmentRoom.room.name}</p>
                  </div>

                  {/* Horario */}
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Horario</p>
                    <p className="text-gray-700 flex flex-wrap gap-1">
                      {assignmentRoom.assignmentSchedules
                        .map((a) => a.day)
                        .join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(assignmentRoom.assignmentSchedules[0]?.schedule.start), 'HH:mm', { locale: es })} –{" "}
                      {format(new Date(assignmentRoom.assignmentSchedules[0]?.schedule.end), 'HH:mm', { locale: es })}
                    </p>
                  </div>

                  {/* Programa */}
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Programa</p>
                    <p className="text-gray-700">
                      {assignmentRoom.room.specialty.name}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}


          {/* Métricas */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {[
              {
                title: "Sesiones Cursadas",
                value: sessionsPresent,
                color: "text-tertiary",
                progress: (sessionsPresent / allSessions.length) * 100,
                icon: <BookOpen className="text-tertiary w-6 h-6" />,
                barColor: "bg-tertiary",
                barbgColor: "bg-tertiary-100",
              },
              {
                title: "Permisos",
                value: sessionsJustified,
                color: "text-yellow-500",
                progress: (sessionsJustified / allSessions.length) * 100,
                icon: <FileWarning className="text-yellow-500 w-6 h-6" />,
                barColor: "bg-yellow-400",
                barbgColor: "bg-yellow-100",
              },
              {
                title: "Faltas",
                value: sessionsAbsent,
                color: "text-red-500",
                progress: (sessionsAbsent / allSessions.length) * 100,
                icon: <Clock className="text-primary w-6 h-6" />,
                barColor: "bg-primary-500",
                barbgColor: "bg-primary-100",
              },
              {
                title: "Sesiones que faltan",
                value: sessionsPending,
                color: "text-orange-500",
                progress: (1 - sessionsPending / allSessions.length) * 100, // 👈 inverso
                icon: <GraduationCap className="text-orange-500 w-6 h-6" />,
                barColor: "bg-orange-400",
                barbgColor: "bg-orange-100",
              },
              {
                title: "Mensualidad",
                value: `${totalMonthBalance} Bs`,
                // sub: "Fecha de pago: 22-11-2022",
                color: "text-green-600",
                icon: <DollarSign className="text-secondary w-6 h-6" />,
                barColor: "bg-secondary",
              },
              {
                title: "Estado de la Cuenta",
                value: `Debe: ${totalBalance} Bs`,
                color: "text-green-600",
                icon: <ClipboardCheck className="text-secondary w-6 h-6" />,
                barColor: "bg-secondary",
              },
            ].map((c, i) => (
              <Card
                key={i}
                className="text-center p-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-between"
              >
                <CardContent className="flex flex-col items-center justify-center w-full p-0">
                  {/* ICONO */}
                  <div className="flex items-center justify-center w-10 h-10 mb-2 bg-gray-50 rounded-4xl">
                    {c.icon}
                  </div>

                  {/* TÍTULO */}
                  <p className={`font-semibold text-sm text-gray-600`}>{c.title}</p>

                  {/* VALOR PRINCIPAL */}
                  <p className={`text-3xl font-bold mt-1 text-gray-600`}>{c.value}</p>

                  {/* SUBTEXTO */}
                  {/* {c.sub && (
                    <p className="text-xs text-gray-600 mt-1">{c.sub}</p>
                  )} */}

                  {/* PROGRESO */}
                  {
                    c.barbgColor &&
                    <div className="w-full mt-3">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Progreso</span>
                        <span>{c.progress}%</span>
                      </div>
                      <Progress
                        value={c.progress}
                        indicatorClassName={c.barColor} // barra principal
                        className={`h-1 mt-1 ${c.barbgColor}`} // fondo más claro (si Tailwind lo detecta)
                      />
                    </div>
                  }
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contador */}
          <div className="md:col-span-3 flex justify-center mt-4">
            <p className="text-gray-700 text-sm">
              Retornando al lector en{" "}
              <span className="text-primary font-bold">{countdown}</span>{" "}
              segundos...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
