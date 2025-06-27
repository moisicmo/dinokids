import type { AssignmentScheduleModel, RoomModel } from "..";

export interface AssignmentRoomModel {
  id: string;
  room: RoomModel;
  start: Date;
  assignmentSchedules: AssignmentScheduleModel[];
}
