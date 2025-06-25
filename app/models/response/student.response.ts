import { EducationLevel, Gender, type MetaPagination, type TutorModel, type UserModel } from "..";


export interface StudentResponse extends MetaPagination {
  data: UserModel[];
}

export interface StudentModel {
  id: number;
  code: string;
  birthdate: Date;
  gender: Gender;
  school: string;
  grade: number;
  educationLevel: EducationLevel;
  tutors: TutorModel[]
}
