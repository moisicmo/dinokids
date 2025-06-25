import { EducationLevel, Gender, type FormUserModel, type FormUserValidations, type TutorModel, type UserRequest } from "..";

export interface StudentRequest extends UserRequest {
  birthdate: Date;
  gender: Gender;
  school: string;
  grade: number;
  educationLevel: EducationLevel;
  tutorIds: string[]
}

export interface FormStudentModel extends FormUserModel {
  birthdate: Date|null;
  gender: Gender | null;
  school: string;
  grade: 0;
  educationLevel: EducationLevel | null;
  tutors: TutorModel[];
}

export interface FormStudentValidations extends FormUserValidations {
  birthdate: [(value: Date) => boolean, string];
  gender: [(value: Gender) => boolean, string];
  school: [(value: string) => boolean, string];
  grade: [(value: number) => boolean, string];
  educationLevel: [(value: EducationLevel) => boolean, string];
  tutors: [(value: TutorModel[]) => boolean, string];
}
