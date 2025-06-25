import type { MetaPagination, UserModel } from "..";


export interface TutorResponse extends MetaPagination {
  data: UserModel[];
}

export interface TutorModel  {
  user?: UserModel;
  id: number;
  city: string;
  zone: string;
  address: string;
}