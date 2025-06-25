import type { PermissionResponse } from '@/models';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialData: PermissionResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
}
export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    dataPermission: initialData,
  },
  reducers: {
    setPermissions: (state, action: PayloadAction<PermissionResponse>) => {
      state.dataPermission = action.payload;
    },
  },
});

export const { setPermissions } = permissionSlice.actions;
