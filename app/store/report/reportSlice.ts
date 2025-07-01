
import type { DashboardModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';


const initialData: DashboardModel = {
  totalStudents: 0,
  totalTutors: 0,
  totalTeachers: 0,
  totalBranches: 0,
  totalInscriptions: 0,
  totalBookings: 0,
  totalRooms: 0,
  totalDebts: 0,
}
export const reportSlice = createSlice({
  name: 'report',
  initialState: {
    dashboard: initialData,
    reportData: [] as any[],
  },
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setReportdata: (state, action) => {
      state.reportData = action.payload.reportData;
    },
  }
});


// Action creators are generated for each case reducer function
export const { setDashboard, setReportdata } = reportSlice.actions;