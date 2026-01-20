import type { Evaluation } from "@/routes/admin/correspondence";

export interface DocumentTransmissionModel {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  document: {
    id: string;
    type: string;
    data: Evaluation[];
  }
}
