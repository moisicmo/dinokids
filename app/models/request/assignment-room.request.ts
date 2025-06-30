import type { AssignmentScheduleRequest, FormAssignmentScheduleModel, RoomModel } from "..";

export interface AssignmentRoomRequest {
  roomId: string;
  start: Date;
  assignmentSchedules: AssignmentScheduleRequest[];
}
export interface FormAssignmentRoomModel {
  room: RoomModel | null;
  start: Date | null;
  assignmentSchedules: FormAssignmentScheduleModel[];
}
