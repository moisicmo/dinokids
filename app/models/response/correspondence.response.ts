import type { Evaluation, Question } from "@/routes/admin/correspondence";

export interface SentTransmissionModel {
  id: string;
  receiverId: string;
  status: string;
  createdAt: string;
  document: { type: string };
}

export interface DocumentTransmissionModel {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  document: {
    id: string;
    type: string;
    data: Evaluation[];
    childInfo?: Question[];
    studentUserId?: string;
  }
}
