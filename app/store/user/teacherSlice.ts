import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TeacherResponse } from '@/models';

const initialData: TeacherResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    dataTeacher: initialData,
  },
  reducers: {
    setTeachers: (state, action: PayloadAction<TeacherResponse>) => {
      state.dataTeacher = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTeachers } = teacherSlice.actions;
