import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StudentResponse } from '@/models';

const initialData: StudentResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const studentSlice = createSlice({
  name: 'student',
  initialState: {
    dataStudent: initialData,
  },
  reducers: {
    setStudents: (state, action: PayloadAction<StudentResponse>) => {
      state.dataStudent = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStudents } = studentSlice.actions;
