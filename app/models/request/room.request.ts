import type { BranchSpecialtiesModel, FormScheduleModel as FormScheduleModel, FormScheduleValidations, ScheduleRequest, SpecialtyModel, TeacherModel } from "..";

export interface RoomRequest {
  name: string;
  rangeYears: number[];
  branchId: string;
  teacherId: string;
  assistantId: string;
  specialtyId: string;
  schedules: ScheduleRequest[]
}



export interface FormRoomModel {
  name: string;
  rangeYears: number[],
  teacher: TeacherModel | null,
  specialty: BranchSpecialtiesModel | null,
  schedules: FormScheduleModel[],
}
export const formRoomInit: FormRoomModel = {
  name: '',
  rangeYears: [5, 5],
  teacher: null,
  specialty: null,
  schedules: [
    {
      day: null,
      start: null,
      end: null,
      capacity: 0,
    }
  ],
};



export interface FormRoomValidations {
  name: [(value: string) => boolean, string];
  rangeYears: [(value: number[]) => boolean, string];
  teacher: [(value: TeacherModel) => boolean, string];
  specialty: [(value: SpecialtyModel) => boolean, string];
  schedules: [(value: FormScheduleValidations[]) => boolean, string];
}

export const formRoomValidations: FormRoomValidations = {
  name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
  rangeYears: [(value) => value.length > 0, 'Debe ingresar rango de edad'],
  teacher: [(value) => value != null, 'Debe ingresar el profesor'],
  specialty: [(value) => value != null, 'Debe ingresar la especialidad'],
  schedules: [(value) => value.length > 0, 'Debe ingresar los horarios'],
};