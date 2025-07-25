import type { AssignmentRoomRequest, FormAssignmentRoomModel, FormBookingModel, StudentModel } from "..";



export interface InscriptionRequest {
  studentId: string;
  inscriptionPrice: number;
  monthPrice: number;
  assignmentRooms: AssignmentRoomRequest[];
}
export interface FormInscriptionModel {
  student: StudentModel | null;
  booking: FormBookingModel | null;
  inscriptionPrice: number;
  monthPrice: number;
  assignmentRooms: FormAssignmentRoomModel[];
}

export const formInscriptionInit: FormInscriptionModel = {
  student: null,
  booking: null,
  inscriptionPrice: 0,
  monthPrice: 0,
  assignmentRooms: [
    {
      room: null,
      start: null,
      assignmentSchedules: [],
    }
  ]
};

interface FormInscriptionValidations {
  student: [(value: StudentModel) => boolean, string];
  inscriptionPrice: [(value: number) => boolean, string];
  monthPrice: [(value: number) => boolean, string];
  assignmentRooms: [(value: FormAssignmentRoomModel[]) => boolean, string];
}

export const formInscriptionValidations: FormInscriptionValidations = {
  student: [(value) => value != null, 'Debe ingresar el estudiante'],
  inscriptionPrice: [(value) => value > 0, 'Debe ingresar el precio de la inscripción'],
  monthPrice: [(value) => value > 0, 'Debe ingresar el precio de la mensualidad'],
  assignmentRooms: [(value) => value.length > 0, 'Debe ingresar almenos una asigación de aula'],
};