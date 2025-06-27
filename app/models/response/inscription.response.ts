import type { AssignmentRoomModel, BookingModel, MetaPagination, PriceModel, RoomModel, ScheduleModel } from "..";
import type { StaffModel } from "..";

export interface InscriptionResponse extends MetaPagination {
  data: InscriptionModel[];
}
export interface InscriptionModel {
  id: string;
  student: StaffModel | null;
  booking: BookingModel | null;
  url: string | null;
  prices: PriceModel[];
  assignmentRooms: AssignmentRoomModel[];
}

