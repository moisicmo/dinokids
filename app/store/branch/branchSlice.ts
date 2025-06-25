import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BranchResponse } from '@/models';

const initialData: BranchResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    dataBranch: initialData,
  },
  reducers: {
    setbranches: (state, action: PayloadAction<BranchResponse>) => {
      state.dataBranch = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setbranches } = branchSlice.actions;