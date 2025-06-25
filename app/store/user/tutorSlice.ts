import type { TutorResponse } from '@/models';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialData: TutorResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const tutorSlice = createSlice({
  name: 'tutor',
  initialState: {
    dataTutor: initialData,
  },
  reducers: {
    setTutors: (state, action: PayloadAction<TutorResponse>) => {
      state.dataTutor = action.payload;
    },
  },
});

// Action creators
export const { setTutors } = tutorSlice.actions;
