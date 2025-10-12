import type { DayOfWeek, ScheduleModel, SessionModel } from "..";


export interface AssignmentScheduleModel {
  id: string;
  schedule: ScheduleModel;
  day: DayOfWeek;
  sessions: SessionModel;
}