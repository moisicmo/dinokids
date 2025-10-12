import type { UserModel } from "./user.response";

export interface AttendanceModel {
  message: string;
  action: string;
  user: UserModel;
}


export interface SessionModel {
  id: string;
  date: Date;
  status: string;
  observation: string | null;
  active: boolean;
  updatedAt: Date;
}