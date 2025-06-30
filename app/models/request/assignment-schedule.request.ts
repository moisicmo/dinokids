import type { DayOfWeek } from "..";


interface ScheduleRequest {
  id: string;
  days: DayOfWeek[];
  start: Date;
  end: Date;
  active?: boolean;
}
export interface AssignmentScheduleRequest {
  schedule: ScheduleRequest;
  day: DayOfWeek;
}

export type FormAssignmentScheduleModel = AssignmentScheduleRequest;
