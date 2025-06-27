import type { DayOfWeek } from "..";

export interface ScheduleModel {
  id: String;
  days: DayOfWeek[];
  start: Date;
  end: Date;
}