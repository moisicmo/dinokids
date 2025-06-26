import type { MetaPagination, UserModel } from "..";


export interface TutorResponse extends MetaPagination {
  data: TutorModel[];
}

export interface TutorModel  {
  userId: string;
  city: string;
  zone: string;
  address: string;
  user: UserModel;
}