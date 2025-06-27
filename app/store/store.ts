import { configureStore } from '@reduxjs/toolkit';
import {
  authSlice,
  branchSlice,
  inscriptionSlice,
  permissionSlice,
  roleSlice,
  roomSlice,
  staffSlice,
  studentSlice,
  teacherSlice,
  tutorSlice,
  monthlyFeeSlice,
  specialtySlice,
  bookingSlice,
  cartSlice,
  reportSlice,
} from '.';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    branches: branchSlice.reducer,
    staffs: staffSlice.reducer,
    teachers: teacherSlice.reducer,
    tutors: tutorSlice.reducer,
    students: studentSlice.reducer,
    inscriptions: inscriptionSlice.reducer,
    bookings: bookingSlice.reducer,
    permissions: permissionSlice.reducer,
    roles: roleSlice.reducer,
    specialties:specialtySlice.reducer,
    rooms: roomSlice.reducer,
    monthlyFees: monthlyFeeSlice.reducer,
    carts:cartSlice.reducer,
    reports: reportSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
