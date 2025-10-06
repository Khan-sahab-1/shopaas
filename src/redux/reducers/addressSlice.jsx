import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URLS } from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';

export const fetchAddressInfo = createAsyncThunk(
  'address/fetchAddressInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await makeApiCall(API_URLS.getAddresses, 'POST', {
        jsonrpc: '2.0',
        params: {},
      });

      if (response.result.message === 'Success') {
        return response?.result?.data;
      } else {
        return rejectWithValue('Failed to fetch address');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'API Error');
    }
  },
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addressInfo: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAddressInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.addressInfo = action.payload;
      })
      .addCase(fetchAddressInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
