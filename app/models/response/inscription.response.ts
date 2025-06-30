import type { AssignmentRoomModel, BookingModel, MetaPagination, PriceModel, StudentModel } from "..";

export interface InscriptionResponse extends MetaPagination {
  data: InscriptionModel[];
}
export interface InscriptionModel {
  id: string;
  inscriptionPrice: number,
  monthPrice: number,
  student: StudentModel | null;
  booking: BookingModel | null;
  url: string | null;
  prices: PriceModel[];
  assignmentRooms: AssignmentRoomModel[];
}

