import type { AssignmentScheduleModel, InscriptionModel, RoomModel } from "..";

export interface AssignmentRoomModel {
  id: string;
  room: RoomModel;
  start: Date;
  inscription: InscriptionModel;
  assignmentSchedules: AssignmentScheduleModel[];
}
