import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../utils/apiurls';
import { persistor } from '../store';
import { fetchSessionInfo } from './sessionSlice';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ login, password }, thunkAPI) => {
    try {
      const response = await fetch(API_URLS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: { login, password },
        }),
      });

      const data = await response.json();

      // console.log('API response:', data); // 🔍 DEBUG LINE

      if (data?.result?.message === 'success') {
        // await dispatch(fetchSessionInfo());
        return data.result;
      } else {
        return thunkAPI.rejectWithValue(
          data?.result?.errorMessage || data?.error || 'Login failed',
        );
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Unexpected error');
    }
  },
);
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      const response = await fetch(API_URLS.logout, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', params: {} }),
      });

      const data = await response.json();

      // Reset redux state
      dispatch({ type: 'LOGOUT' });

      // Clear persisted storage
      await persistor.purge();

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Unexpected error');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isLoading: false,
    user: null,
    error: null,
  },
  reducers: {
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
