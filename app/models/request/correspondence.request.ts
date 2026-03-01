import type { Evaluation, Question } from "@/routes/admin/correspondence";

export interface CorrespondenceRequest {
  type: string;
  data: Evaluation[];
  receiverId: string;
  childInfo?: Question[];
  studentUserId?: string;
  sourceDocumentId?: string;
}
