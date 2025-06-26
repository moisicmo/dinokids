import { EducationLevel, Gender, type MetaPagination, type TutorModel, type UserModel } from "..";


export interface StudentResponse extends MetaPagination {
  data: StudentModel[];
}

export interface StudentModel {
  userId: string;
  code: string;
  birthdate: Date;
  gender: Gender;
  school: string;
  grade: number;
  educationLevel: EducationLevel;
  tutors: TutorModel[];
  user: UserModel;
}
