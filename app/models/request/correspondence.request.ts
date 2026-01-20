import type { Evaluation } from "@/routes/admin/correspondence";

export interface CorrespondenceRequest {
  type: string;
  data: Evaluation[];
  receiverId: string;
}
