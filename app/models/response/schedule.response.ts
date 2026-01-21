import type { DayOfWeek } from "..";

export interface ScheduleModel {
  id: string;
  day: DayOfWeek;
  start: Date;
  end: Date;
  color?: string;
  capacity: number;
}