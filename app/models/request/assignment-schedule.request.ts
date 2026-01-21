import type { DayOfWeek } from "..";


interface ScheduleRequest {
  id: string;
  days: DayOfWeek[];
  start: Date;
  end: Date;
  color: string;
  active?: boolean;
}
export interface AssignmentScheduleRequest {
  schedule: ScheduleRequest;
  day: DayOfWeek;
}

export type FormAssignmentScheduleModel = AssignmentScheduleRequest;
