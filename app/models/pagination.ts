import type {
  BranchModel,
  InscriptionModel,
  PermissionModel,
  RoleModel,
  RoomModel,
  ScheduleModel,
  SpecialtyModel,
  StaffModel,
  StudentModel,
  TeacherModel,
  TutorModel,
} from '.';

export interface MetaPagination {
  total: number;
  page: number;
  lastPage: number;
}

export interface DataModel {
  page: number;
  limit: number;
  total: number;
  next?: string;
  prev?: string;
  tutors?: TutorModel[];
  teachers?: TeacherModel[];
  students?: StudentModel[];
  schedules?: ScheduleModel[];
  inscriptions?: InscriptionModel[];
  bookings?: InscriptionModel[];
}
