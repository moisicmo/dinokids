import type { MetaPagination } from "..";

export interface BranchResponse extends MetaPagination {
  data: BranchModel[];
}

export interface BranchModel {
  id: string;
  name: string;
  address: string;
  phone: number;
}
