import { DayOfWeek } from "../enums";

export interface ScheduleRequest {
  days: DayOfWeek[];
  start: Date;
  end: Date;
  roomId: number;
}