import type { SlotInfo } from "react-big-calendar";
import type { BranchModel, RoomModel, StudentModel } from "..";


export interface InscriptionRequest {
  id?: number;
  student?: StudentModel;
  branch?: BranchModel;
  rooms?: RoomSelectedRequest[];
  inscriptionPrice?: number;
  monthPrice?: number;
}

export interface RoomSelectedRequest extends RoomModel {
  assignmentSchedule?: SlotInfo[];
  start?: Date;
}