import type { AssignmentRoomRequest, FormAssignmentRoomModel, FormInscriptionModel } from "..";

export interface BookingRequest {
  days: number;
  dni: string;
  name: string;
  phone: string[];
  amount: number;
  assignmentRooms: AssignmentRoomRequest[];
}

export interface FormBookingModel {
  days: number;
  dni: string;
  name: string;
  phone: string[];
  amount: number;
}

export const formBookingInscriptionInit: FormInscriptionModel = {
  student: null,
  booking: {
    days: 0,
    dni: '',
    name: '',
    phone: [''],
    amount: 0.00
  },
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


export const formBookingValidations = {
  booking: {
    name: [(value: string) => value.trim().length > 0, 'El nombre es obligatorio'],
    dni: [(value: string) => value.trim().length > 0, 'El número de documento es obligatorio'],
    phone: [(value: string[]) => value.length > 0 && value[0].length > 0, 'Debe ingresar al menos un teléfono'],
    amount: [(value: number) => value > 0, 'El monto debe ser mayor a 0'],
    days: [(value: number) => value > 0, 'La cantidad de días debe ser mayor a 0'],
  },
  assignmentRooms: [(value: FormAssignmentRoomModel[]) => value.length > 0, 'Debe asignar al menos un ambiente'],
};

