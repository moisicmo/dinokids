export enum Gender {
  MASCULINO = "masculino",
  FEMENINO = "femenino",
}
export enum EducationLevel {
  PRIMARIA = "primario",
  SECUNDARIA = "secundario",
}

export enum DayOfWeek {
  MONDAY = 'lunes',
  TUESDAY = 'martes',
  WEDNESDAY = 'miercoles',
  THURSDAY = 'jueves',
  FRIDAY = 'viernes',
  SATURDAY = 'sábado',
  SUNDAY = 'domingo',
}

export enum AcademicStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EGRESADO = 'egresado',
  TITULADO = 'titulado',
  MAESTRIA = 'maestria'
}

export enum TypeAction {
  manage = "Manejar",
  create = "Crear",
  read = "Leer",
  update = "Editar",
  delete = "Eliminar",
}

export enum TypeSubject {
  branch = "sucursales",
  permission = "permisos",
  role = "roles",
  user = "usuarios",
  staff = "staffs",
  tutor = "tutores",
  teacher = "profesores",
  student = "estudiantes",
  sessionTracking = "seguimiento de sesiones",
  weeklyPlanning = "planificación semanal",
  evaluationPlanning = "planificación de evaluaciones",
  assignmentRoom = "asignación de aulas",
  assignmentSchedule = "asignación de horarios",
  booking = "reservas",
  room = "aulas",
  specialty = "especialidades",
  schedule = "horarios",
  inscription = "incripciones",
  payment = "pagos",
  invoice = "facturas",
  refund = "devoluciones",
  price = "precios",
  report = "reportes",
  debt = "deudas",
  attendance = 'asistencias',
  correspondence = 'correspondencias',
  evaluationInit = 'evaluacion inicial',
  evaluationCondoctual = 'evaluacion conductual',
  evaluationKinder = 'evaluacion kinder',
  evaluation123Primaria = 'evaluacion 1ro 2do 3ro primaria',
  evaluation456Primaria = 'evaluacion 4to 5to 6to primaria',
  evaluation123Secundaria = 'evaluacion 1ro 2do 3ro secundaria',
}

export enum TypeDebt {
  BOOKING = "RESERVA",
  INSCRIPTION = "INSCRIPCIÓN",
  MONTH = "MENSUALIDAD",
  PER_SESSION = "POR SESIÓN",
}

export enum PayMethod {
  CASH = "EFECTIVO",
  BANK = "TRANSFERENCIA",
  QR = "PAGO QR",
} 