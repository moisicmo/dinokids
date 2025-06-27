import { DayOfWeek } from "../enums";

export interface ScheduleRequest {
  days: DayOfWeek[];
  start: Date;
  end: Date;
}

export interface FormScheduleModel {
  days: DayOfWeek[],
  start: Date | null,
  end: Date | null,
}

export interface FormScheduleValidations {
  days: [(value: DayOfWeek[]) => boolean, string];
  start: [(value: Date) => boolean, string];
  end: [(value: Date) => boolean, string];
}