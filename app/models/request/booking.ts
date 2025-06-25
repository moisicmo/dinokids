import type { BranchModel, RoomSelectedRequest } from "..";

export interface BookingRequest {
  days: number;
  dni: string;
  name: string;
  amount: number;
  branch?: BranchModel;
  rooms?: RoomSelectedRequest[];
}
// export interface InscriptionRequest {
//   student?: StudentModel;
//   branch?: BranchModel;
//   rooms?: RoomSelectedRequest[];
//   inscriptionPrice?: number;
//   monthPrice?: number;
// }

// export interface RoomSelectedRequest extends RoomModel {
//   assignmentSchedule?: SlotInfo[];
//   start?: Date;
// }