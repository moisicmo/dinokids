import type { Evaluation, Question } from "@/routes/admin/correspondence";

export interface SentTransmissionModel {
  id: string;
  status: string;
  createdAt: string;
  receiver: { name: string; lastName: string; role?: { name: string } | null };
  document: { type: string; studentUserId?: string | null; childInfo?: { question: string; answer: string | null }[] };
}

export interface AdminSentTransmissionModel {
  id: string;
  status: string;
  createdAt: string;
  sender: { name: string; lastName: string; role?: { name: string } | null };
  receiver: { name: string; lastName: string; role?: { name: string } | null };
  document: { type: string; studentUserId?: string | null; childInfo?: { question: string; answer: string | null }[] };
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
