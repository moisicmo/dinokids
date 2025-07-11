import { EducationLevel, Gender, type TutorModel, type UserModel } from "..";

export interface StudentModel {
  userId: string;
  code: string;
  birthdate: Date;
  gender: Gender;
  school: {
    id: string;
    name: string;
  };
  grade: number;
  educationLevel: EducationLevel;
  tutors: TutorModel[];
  user: UserModel;
}
