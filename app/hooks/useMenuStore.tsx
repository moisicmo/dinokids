import { usePermissionStore } from '@/hooks';
import { TypeAction, TypeSubject } from '@/models';
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
  CalendarDays as Attendance,
  MessageSquareText as Correspondence,
  CreditCard as Payment,
  School as Specialty,
  DollarSign as Price,
  ArrowLeftRight as Refund,
  BarChart3 as ReportIcon,
  UserCog as Users,
  School,
  DollarSign,
} from 'lucide-react';

interface MenuItem {
  path?: string;
  title: string;
  icon: React.ReactNode;
  group?: MenuItem[];
}

export const useMenu = (): MenuItem[] => {
  const { requirePermission } = usePermissionStore();

  const hasPermission = (action: TypeAction, subject: TypeSubject): boolean => {
    try {
      requirePermission(action, subject);
      return true;
    } catch {
      return false;
    }
  };

  const menuItems: MenuItem[] = [];

  // Dashboard (siempre visible)
  menuItems.push({
    path: '/admin/dashboard',
    title: 'Dashboard',
    icon: <Home size={18} />,
  });

  // Asistencias
  if (hasPermission(TypeAction.manage, TypeSubject.attendance)) {
    menuItems.push({
      path: '/admin/attendance',
      title: 'Asistencias',
      icon: <Attendance size={18} />,
    });
  }

  // Académico
  const academicItems: MenuItem[] = [];
  
  if (hasPermission(TypeAction.read, TypeSubject.inscription)) {
    academicItems.push({
      path: '/admin/inscription',
      title: 'Inscripciones',
      icon: <Inscription size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.booking)) {
    academicItems.push({
      path: '/admin/booking',
      title: 'Reservas',
      icon: <Booking size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.room)) {
    academicItems.push({
      path: '/admin/room',
      title: 'Aulas',
      icon: <Room size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.specialty)) {
    academicItems.push({
      path: '/admin/specialty',
      title: 'Especialidades',
      icon: <Specialty size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.teacher)) {
    academicItems.push({
      path: '/admin/teacher',
      title: 'Profesores',
      icon: <Teacher size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.student)) {
    academicItems.push({
      path: '/admin/student',
      title: 'Estudiantes',
      icon: <Student size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.tutor)) {
    academicItems.push({
      path: '/admin/tutor',
      title: 'Tutores',
      icon: <Tutor size={18} />,
    });
  }
  
  if (academicItems.length > 0) {
    menuItems.push({
      title: 'Académico',
      icon: <School size={18} />,
      group: academicItems,
    });
  }

  // Finanzas
  const financeItems: MenuItem[] = [];
  
  if (hasPermission(TypeAction.read, TypeSubject.payment)) {
    financeItems.push({
      path: '/admin/payment',
      title: 'Pagos',
      icon: <Payment size={18} />,
    });
  }
  
  // if (hasPermission(TypeAction.read, TypeSubject.debt)) {
  //   financeItems.push({
  //     path: '/admin/debt',
  //     title: 'Deudas',
  //     icon: <Debt size={18} />,
  //   });
  // }
  
  // if (hasPermission(TypeAction.read, TypeSubject.refund)) {
  //   financeItems.push({
  //     path: '/admin/refund',
  //     title: 'Devoluciones',
  //     icon: <Refund size={18} />,
  //   });
  // }
  
  if (financeItems.length > 0) {
    menuItems.push({
      title: 'Finanzas',
      icon: <DollarSign size={18} />,
      group: financeItems,
    });
  }

  // Administración
  const adminItems: MenuItem[] = [];
  
  if (hasPermission(TypeAction.read, TypeSubject.branch)) {
    adminItems.push({
      path: '/admin/branch',
      title: 'Sucursales',
      icon: <Branch size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.staff)) {
    adminItems.push({
      path: '/admin/staff',
      title: 'Staff',
      icon: <Staff size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.role)) {
    adminItems.push({
      path: '/admin/role',
      title: 'Roles',
      icon: <Role size={18} />,
    });
  }
  
  if (hasPermission(TypeAction.read, TypeSubject.permission)) {
    adminItems.push({
      path: '/admin/permission',
      title: 'Permisos',
      icon: <Permission size={18} />,
    });
  }
  
  if (adminItems.length > 0) {
    menuItems.push({
      title: 'Administración',
      icon: <Users size={18} />,
      group: adminItems,
    });
  }

  // Comunicación
  if (hasPermission(TypeAction.read, TypeSubject.correspondence)) {
    menuItems.push({
      title: 'Comunicación',
      icon: <Correspondence size={18} />,
      group: [{
        path: '/admin/correspondence',
        title: 'Correspondencias',
        icon: <Correspondence size={18} />,
      }],
    });
  }

  // Reportes
  if (hasPermission(TypeAction.read, TypeSubject.report)) {
    menuItems.push({
      title: 'Reportes',
      icon: <ReportIcon size={18} />,
      group: [
        {
          path: '/admin/report/inscription',
          title: 'Inscripciones',
          icon: <Report size={18} />,
        },
        {
          path: '/admin/report/debt',
          title: 'Deudas',
          icon: <Report size={18} />,
        },
        {
          path: '/admin/report/attendance',
          title: 'Asistencias',
          icon: <Report size={18} />,
        },
        {
          path: '/admin/report/financial',
          title: 'Financiero',
          icon: <Report size={18} />,
        },
      ],
    });
  }

  return menuItems;
};