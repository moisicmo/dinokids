import type { InscriptionModel, MetaPagination } from "..";

export interface BookingResponse extends MetaPagination {
  data: InscriptionModel[];
}

export interface BookingModel {
  id: string;
  days: number;
  dni: string;
  name: string;
  amount: number;
}