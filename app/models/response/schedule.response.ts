import type { DayOfWeek } from "..";

export interface ScheduleModel {
  id: string;
  days: DayOfWeek[];
  start: Date;
  end: Date;
}