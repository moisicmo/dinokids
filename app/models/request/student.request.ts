import { EducationLevel, formUserInit, formUserValidations, Gender, type FormUserModel, type FormUserValidations, type TutorModel, type UserRequest } from "..";

export interface StudentRequest extends UserRequest {
  birthdate: Date;
  gender: Gender;
  school: string;
  grade: number;
  educationLevel: EducationLevel;
  tutorIds: string[]
}

export interface FormStudentModel {
  user: FormUserModel,
  birthdate: Date|null;
  gender: Gender | null;
  school: string;
  grade: 0;
  educationLevel: EducationLevel | null;
  tutors: TutorModel[];
}
export const formStudentInit: FormStudentModel = {
  user: formUserInit,
  birthdate: null,
  gender: null,
  school: '',
  grade: 0,
  educationLevel: null,
  tutors: [],
};

export interface FormStudentValidations {
  user: FormUserValidations;
  birthdate: [(value: Date) => boolean, string];
  gender: [(value: Gender) => boolean, string];
  school: [(value: string) => boolean, string];
  grade: [(value: number) => boolean, string];
  educationLevel: [(value: EducationLevel) => boolean, string];
  tutors: [(value: TutorModel[]) => boolean, string];
}

export const formStudentValidations: FormStudentValidations = {
  user: formUserValidations,
  birthdate: [(value) => value != null, 'Debe ingresar la fecha de nacimiento'],
  gender: [(value) => value != null, 'Debe ingresar el género'],
  school: [(value) => value.length > 0, 'Debe ingresar el colegio'],
  grade: [(value) => value > 0, 'Debe ingresar el grado'],
  educationLevel: [(value) => value != null, 'Debe ingresar el nivel'],
  tutors: [(value) => value.length > 0, 'Debe ingresar al menos un tutor'],
};