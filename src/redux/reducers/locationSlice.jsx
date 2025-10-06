// src/redux/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  confirmedLocation: '',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setConfirmedLocation: (state, action) => {
      state.confirmedLocation = action.payload;
    },
    clearLocation: state => {
      state.confirmedLocation = '';
    },
  },
});

export const { setConfirmedLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
