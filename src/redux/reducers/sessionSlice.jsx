// src/redux/sessionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URLS } from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';


// Thunk to fetch session info
export const fetchSessionInfo = createAsyncThunk(
  'session/fetchSessionInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await makeApiCall(API_URLS.getSessionInfo, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });
      return response.result; 
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSession: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSessionInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
