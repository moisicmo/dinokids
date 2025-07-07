import type { BranchModel, ScheduleModel, SpecialtyModel, TeacherModel } from "..";

export interface RoomModel {
  id: string;
  name: string;
  capacity: number;
  rangeYears: number[];
  branch: BranchModel;
  teacher: TeacherModel;
  specialty: SpecialtyModel;
  schedules: ScheduleModel[]
}