import type { DayOfWeek } from "..";

export interface AssignmentScheduleRequest {
  scheduleId: string;
  day: DayOfWeek;
}

export type FormAssignmentScheduleModel = AssignmentScheduleRequest;
