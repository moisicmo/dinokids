import { bookingSlice, branchSlice, inscriptionSlice, permissionSlice, roleSlice, roomSlice, specialtySlice, staffSlice, studentSlice, teacherSlice, tutorSlice } from '@/store';
import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    staffs: staffSlice.reducer,
    students: studentSlice.reducer,
    teachers: teacherSlice.reducer,
    tutors: tutorSlice.reducer,
    branches: branchSlice.reducer,
    rooms: roomSlice.reducer,
    roles: roleSlice.reducer,
    permissions: permissionSlice.reducer,
    specialties: specialtySlice.reducer,
    inscriptions: inscriptionSlice.reducer,
    bookings: bookingSlice.reducer,
    // aquí puedes seguir agregando más reducers...
  },
});

// 🔁 Tipos globales basados en toda la configuración del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Hooks tipados reutilizables
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
