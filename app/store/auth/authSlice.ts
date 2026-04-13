import type { BranchModel, RoleModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

interface UserProfile {
  name: string;
  lastName: string;
  email: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',
    user: {},
    userId: null as string | null,
    userProfile: { name: '', lastName: '', email: '' } as UserProfile,
    roleUser: null as RoleModel | null,
    branchesUser: [] as BranchModel[],
    branchSelect: null as BranchModel | null,
  },
  reducers: {
    onLogin: (state, { payload }) => {
      state.status = 'authenticated';
      state.user = payload;
    },
    onLogout: (state) => {
      state.status = 'not-authenticated';
      state.user = {};
      state.userId = null;
      state.userProfile = { name: '', lastName: '', email: '' };
    },
    setUserProfile: (state, { payload }: { payload: UserProfile }) => {
      state.userProfile = payload;
    },
    setUserId: (state, { payload }: { payload: string }) => {
      state.userId = payload;
    },
    setRoleUser: (state, { payload }) => {
      state.roleUser = payload.role;
    },
    setBranchesUser: (state, { payload }) => {
      state.branchesUser = payload.branches;
    },
    setBranch: (state, { payload }) => {
      state.branchSelect = payload.branch;
    },
  }
});


// Action creators are generated for each case reducer function
export const { onLogin, onLogout, setUserProfile, setUserId, setRoleUser, setBranchesUser, setBranch } = authSlice.actions;