import type { DayOfWeek, ScheduleModel } from "..";


export interface AssignmentScheduleModel {
  id: string;
  schedule: ScheduleModel;
  day: DayOfWeek;
}