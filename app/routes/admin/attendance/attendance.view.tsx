import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAttendanceStore, useAuthStore, useForm, usePermissionStore } from "@/hooks";
import { formAttendanceFields, formAttendanceValidations, TypeAction, TypeSubject, type AttendanceSearchResult } from "@/models";
import { InputCustom } from "@/components";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  GraduationCap,
  FileWarning,
  Clock,
  BookOpen,
  DollarSign,
  ClipboardCheck,
  Search,
  UserCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AttendanceView() {
  const [countdown, setCountdown] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rfidInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { dataAttendance, searchResults, isSearching, setAttendance, searchStudents, clearData } = useAttendanceStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { branchSelect } = useAuthStore();
  const { hasPermission } = usePermissionStore();

  const {
    numberCard,
    onInputChange,
    isFormValid,
    onValueChange,
    numberCardValid,
  } = useForm(formAttendanceFields, formAttendanceValidations);

  // Lector RFID: auto-confirmar al llegar a 10 caracteres
  useEffect(() => {
    if (numberCard.length === 10) {
      handleConfirmByCard(numberCard);
    }
  }, [numberCard]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    await searchStudents(searchQuery, `${branchSelect?.id}`);
    setHasSearched(true);
  };

  const handleConfirmByCard = async (rfid: string) => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    await setAttendance({ branchId: `${branchSelect?.id}`, numberCard: rfid });
    onValueChange("numberCard", "");
    resetTimer();
  };

  const handleConfirmByUserId = async (userId: string) => {
    await setAttendance({ branchId: `${branchSelect?.id}`, userId });
    setSearchQuery('');
    setHasSearched(false);
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
              : []
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

  const showSearchResults = hasSearched && !dataAttendance;

  return (
    <div className="w-full p-4 md:p-6 flex flex-col">
      {/* Input invisible para lector RFID */}
      <div className="absolute opacity-0 pointer-events-none">
        <InputCustom
          name="numberCard"
          ref={rfidInputRef}
          value={numberCard}
          label="Número de tarjeta"
          onChange={onInputChange}
          error={!!numberCardValid && formSubmitted}
          helperText={formSubmitted ? numberCardValid : ""}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-medium">Registro de Asistencia</h2>
      </div>

      {/* Vista: datos confirmados del estudiante */}
      {dataAttendance ? (
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
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Nombre de la Psicopedagoga</p>
                    <p className="text-gray-700">
                      {assignmentRoom.room.teacher.user.name}{" "}
                      {assignmentRoom.room.teacher.user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Nombre de la sala</p>
                    <p className="text-gray-700">{assignmentRoom.room.name}</p>
                  </div>
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Horario</p>
                    <p className="text-gray-700 flex flex-wrap gap-1">
                      {assignmentRoom.assignmentSchedules.map((a) => a.day).join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(assignmentRoom.assignmentSchedules[0]?.schedule.start), 'HH:mm', { locale: es })} –{" "}
                      {format(new Date(assignmentRoom.assignmentSchedules[0]?.schedule.end), 'HH:mm', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-tertiary font-semibold mb-0.5">Programa</p>
                    <p className="text-gray-700">{assignmentRoom.room.specialty.name}</p>
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
                progress: (1 - sessionsPending / allSessions.length) * 100,
                icon: <GraduationCap className="text-orange-500 w-6 h-6" />,
                barColor: "bg-orange-400",
                barbgColor: "bg-orange-100",
              },
              {
                title: "Mensualidad",
                value: `${totalMonthBalance} Bs`,
                color: "text-green-600",
                icon: <DollarSign className="text-secondary w-6 h-6" />,
                barColor: "bg-secondary",
                permission: () => hasPermission(TypeAction.read, TypeSubject.debt),
              },
              {
                title: "Estado de la Cuenta",
                value: `Debe: ${totalBalance} Bs`,
                color: "text-green-600",
                icon: <ClipboardCheck className="text-secondary w-6 h-6" />,
                barColor: "bg-secondary",
                permission: () => hasPermission(TypeAction.read, TypeSubject.debt),
              },
            ]
              .filter((c) => !c.permission || c.permission())
              .map((c, i) => (
                <Card
                  key={i}
                  className="text-center p-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-between"
                >
                  <CardContent className="flex flex-col items-center justify-center w-full p-0">
                    <div className="flex items-center justify-center w-10 h-10 mb-2 bg-gray-50 rounded-4xl">
                      {c.icon}
                    </div>
                    <p className="font-semibold text-sm text-gray-600">{c.title}</p>
                    <p className="text-3xl font-bold mt-1 text-gray-600">{c.value}</p>
                    {c.barbgColor && (
                      <div className="w-full mt-3">
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Progreso</span>
                          <span>{c.progress}%</span>
                        </div>
                        <Progress
                          value={c.progress}
                          indicatorClassName={c.barColor}
                          className={`h-1 mt-1 ${c.barbgColor}`}
                        />
                      </div>
                    )}
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
      ) : (
        /* Vista: búsqueda + espera RFID */
        <div className="flex flex-col items-center gap-6 flex-1">
          {/* Buscador manual */}
          <div className="w-full max-w-lg">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por nombre, apellido o N° de documento..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || searchQuery.trim().length < 2}
                className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {showSearchResults && (
            <div className="w-full max-w-lg">
              {isSearching ? (
                <p className="text-sm text-gray-500 text-center py-4">Buscando...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No se encontraron estudiantes
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                  {searchResults.map((result: AttendanceSearchResult) => (
                    <div
                      key={result.userId}
                      className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-gray-800">
                          {result.user.name} {result.user.lastName}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            <span className="font-medium text-gray-600">CI:</span>{' '}
                            {result.user.numberDocument ?? '—'}
                          </span>
                          <span>
                            <span className="font-medium text-gray-600">Tarjeta:</span>{' '}
                            {result.user.numberCard ?? '—'}
                          </span>
                        </div>
                        {result.tutors.length > 0 && (
                          <p className="text-xs text-gray-400">
                            <span className="font-medium text-gray-500">Tutor:</span>{' '}
                            {result.tutors[0].user.name} {result.tutors[0].user.lastName}
                            {result.tutors[0].user.numberDocument
                              ? <span className="ml-1">· <span className="font-medium text-gray-500">CI:</span> {result.tutors[0].user.numberDocument}</span>
                              : ''}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConfirmByUserId(result.user.id)}
                        className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        Confirmar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Indicador RFID */}
          {!showSearchResults && (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-60 h-60 border-4 border-dashed border-primary rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-primary font-semibold text-lg">
                    Pase su tarjeta
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
