import type { BranchModel, MetaPagination, SpecialtyModel, TeacherModel } from "..";


export interface RoomResponse extends MetaPagination {
  data: RoomModel[];
}

export interface RoomModel {
  id: string;
  name: string;
  capacity: number;
  rangeYears: number[];
  branch: BranchModel;
  teacher: TeacherModel;
  specialty: SpecialtyModel;
}