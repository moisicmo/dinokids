import type { AddressModel, StaffModel, StudentModel, TeacherModel, TutorModel } from "..";

export interface UserModel {
  id: string;
  numberDocument: string;
  typeDocument: string;
  name: string;
  lastName: string | null;
  email: string;
  phone?: string[];
  staff?: StaffModel;
  student?: StudentModel;
  teacher?: TeacherModel;
  tutor?:TutorModel;
  address?: AddressModel;
}
