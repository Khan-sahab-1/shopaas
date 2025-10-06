// redux/reducers/signupSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../utils/apiurls';

export const signupAsync = createAsyncThunk(
  'signup/signupUser',
  async (
    {
      email,
      name,
      password,
      confirmPassword,
      selectedCountryId,
      selectedCountryCode,
      selectedCountryName,
      selectedCountryShortCode,
      mobileNumber,
      languageId = 1, // default to 1 if not passed
    },
    thunkAPI
  ) => {
    try {
      const response = await fetch(API_URLS.sign_up, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            email,
            name,
            passwd: password,
            confirmPasswd: confirmPassword,
            mobile: mobileNumber,
            phone_code: parseInt(selectedCountryCode),
            country: {
              id: parseInt(selectedCountryId),
              name: selectedCountryName,
              phone_code: parseInt(selectedCountryCode),
              code: selectedCountryShortCode,
            },
            language: {
              id: parseInt(languageId),
            },
          },
        }),
      });

      const data = await response.json();
    console.log(data,'ApiData')
      // Success: backend returns result.success or redirectPage
      if (data.result && (data.result.success || data.result.redirectPage)) {
        return data.result;
      } else {
        return thunkAPI.rejectWithValue(data?.errorMessage || data?.error?.message || 'Signup failed');
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Network error');
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    isLoading: false,
    user: null,
    error: null,
    isSignedUp: false,
  },
  reducers: {
    resetSignupState: (state) => {
      state.isLoading = false;
      state.user = null;
      state.error = null;
      state.isSignedUp = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSignedUp = true;
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
        state.isSignedUp = false;
      });
  },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;
