import type { AssignmentRoomModel, BookingModel, PriceModel, StudentModel } from "..";

export interface InscriptionModel {
  id: string;
  inscriptionPrice: number,
  monthPrice: number,
  student: StudentModel | null;
  booking: BookingModel | null;
  url: string | null;
  prices: PriceModel[];
  assignmentRooms: AssignmentRoomModel[];
  createdAt: Date;
}

