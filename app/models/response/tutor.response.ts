import type { UserModel } from "..";

export interface TutorModel  {
  userId: string;
  city: string;
  zone: string;
  address: string;
  user: UserModel;
}