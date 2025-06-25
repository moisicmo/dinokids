import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RoomResponse } from '@/models';


const initialData: RoomResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    dataRoom: initialData,
  },
  reducers: {
    setRooms: (state, action: PayloadAction<RoomResponse>) => {
      state.dataRoom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms } = roomSlice.actions;
