import type { BranchModel, InscriptionDebtModel, RoomSelectedRequest, StaffModel, StudentModel } from "..";

export interface InscriptionModel {
  id: number;
  url: string;
  branch : BranchModel;
  inscriptionPrice: number;
  monthPrice: number;
  createdAt: Date;
  student: StudentModel | null;
  // booking: BookingsModel | null;
  staff: StaffModel;
  rooms: RoomSelectedRequest[];
  // assignmentRooms: AssignmentRooms[];
  inscriptionDebts: InscriptionDebtModel[];
}