import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RoleResponse } from '@/models';

const initialData: RoleResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
}
export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    dataRole: initialData,
  },
  reducers: {
    setRoles: (state, action: PayloadAction<RoleResponse>) => {
      state.dataRole = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoles } = roleSlice.actions;
