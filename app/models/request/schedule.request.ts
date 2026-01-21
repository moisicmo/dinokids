import { DayOfWeek } from "../enums";

export interface ScheduleRequest {
  days: DayOfWeek[];
  start: Date;
  end: Date;
  capacity: number;
  color?: string;
}

export interface FormScheduleModel {
  id?: string;
  active?: boolean;
  day: DayOfWeek | null,
  start: Date | null,
  end: Date | null,
  capacity: number;
  color?: string;
}

export interface FormScheduleValidations {
  days: [(value: DayOfWeek[]) => boolean, string];
  start: [(value: Date) => boolean, string];
  end: [(value: Date) => boolean, string];
  capacity: [(value: number) => boolean, string];
  color?: [(value: string) => boolean, string];
}