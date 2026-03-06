import type { DebtModel } from "./debt.response";
import type { BranchModel } from "./branch.response";


interface inscriptionData {
  month: string;
  count: number;
}

interface BranchDashboardData {
  branch: BranchModel;
  metrics: {
    totalBranches: number;
    totalStudents: number;
    totalTeachers: number;
    totalDebts: number;
    totalPayments: number;
  };
  inscriptionsData: inscriptionData[];
  debts: DebtModel[];
}

export interface DashboardModel {
  debts: DebtModel[];
  inscriptionsData: inscriptionData[];
  metrics: {
    totalBranches: number;
    totalDebts: number;
    totalPayments: number;
    totalStudents: number;
    totalTeachers: number;
  };
  allBranchesData?: BranchDashboardData[];
}

export const initDashboardModel:DashboardModel = {
  debts:[],
  inscriptionsData: [],
  metrics:{
    totalBranches: 0,
    totalDebts: 0,
    totalPayments: 0,
    totalStudents: 0,
    totalTeachers: 0,
  },
  allBranchesData: [],
}