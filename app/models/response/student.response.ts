import { EducationLevel, Gender, StudentStatus, type InscriptionModel, type TutorModel, type UserModel } from "..";

export interface StudentModel {
  userId: string;
  code: string;
  birthdate: Date;
  gender: Gender;
  school: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  grade: number;
  educationLevel: EducationLevel;
  status: StudentStatus;
  abandonedAt: string | null;
  tutors: TutorModel[];
  user: UserModel;
  inscriptions: InscriptionModel[];
  sessionTrackings?: JSON;
  weeklyPlannings?: JSON;
  evaluationPlannings?: JSON;
}