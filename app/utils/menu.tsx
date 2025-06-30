import {
  Home,
  Building2 as Branch,
  Users2 as Staff,
  KeyRound as Role,
  ShieldCheck as Permission,
  BookOpenText as Teacher,
  GraduationCap as Student,
  UserCheck2 as Tutor,
  ClipboardList as Inscription,
  CalendarClock as Booking,
  MonitorSmartphone as Room,
  HandCoins as Debt,
  FileBarChart2 as Report,
  GraduationCap,
} from 'lucide-react';

export const menu = () => {
  return [
    {
      path: '/admin/dashboard',
      title: 'Dashboard',
      icon: <Home size={18} />,
    },
    {
      title: 'Administración',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/inscription/debt',
          title: 'Pagos',
          icon: <Debt size={18} />,
        },
        {
          path: '/admin/inscription',
          title: 'Inscripciones',
          icon: <Inscription size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/booking',
          title: 'Reservas',
          icon: <Booking size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/room',
          title: 'Aulas',
          icon: <Room size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/specialty',
          title: 'Especialidades',
          icon: <GraduationCap size={18} />,
          permission: 'show-halls',
        },
      ],
    },
    {
      title: 'Administradores',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/branch',
          title: 'Sucursales',
          icon: <Branch size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/staff',
          title: 'Staff',
          icon: <Staff size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/role',
          title: 'Roles',
          icon: <Role size={18} />,
          permission: 'show-halls',
        },
      ],
    },
    {
      title: 'Usuarios',
      permission: 'show-rent',
      group: [
        {
          path: '/admin/teacher',
          title: 'Profesores',
          icon: <Teacher size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/student',
          title: 'Estudiantes',
          icon: <Student size={18} />,
          permission: 'show-halls',
        },
        {
          path: '/admin/tutor',
          title: 'Tutores',
          icon: <Tutor size={18} />,
          permission: 'show-halls',
        },
      ],
    },
    {
      title: 'Reportes',
      permission: 'show-rent',
      group: [
        {
          path: '/ReportView',
          title: 'Reportes',
          icon: <Report size={18} />,
          permission: 'show-halls',
        },
      ],
    },
  ];
};
