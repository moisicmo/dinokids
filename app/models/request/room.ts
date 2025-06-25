import type { BranchModel, SpecialtyModel, TeacherModel } from "..";

export interface RoomRequest {
  name: string;
  capacity: number;
  rangeYears: number[];
  branchId: number;
  teacherId: number;
  specialtyId: number;
}

export interface FormRoomModel {
  name: string;
  capacity: number,
  rangeYears: number[],
  branch: BranchModel | null,
  teacher: TeacherModel | null,
  specialty: SpecialtyModel | null,
}

export interface FormRoomValidations {
  name: [(value: string) => boolean, string];
  capacity: [(value: number) => boolean, string];
  rangeYears: [(value: number[]) => boolean, string];
  branch: [(value: BranchModel) => boolean, string];
  teacher: [(value: TeacherModel) => boolean, string];
  specialty: [(value: SpecialtyModel) => boolean, string];
}