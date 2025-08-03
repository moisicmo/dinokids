import type { AssignmentRoomModel, BranchModel, InscriptionModel, ScheduleModel, SpecialtyModel, TeacherModel } from "..";
export interface RoomModel {
  id: string;
  name: string;
  rangeYears: number[];
  branch: BranchModel;
  teacher: TeacherModel;
  assistant: TeacherModel;
  specialty: SpecialtyModel;
  schedules: ScheduleModel[];
  assignmentRooms: AssignmentRoomModel[];
}