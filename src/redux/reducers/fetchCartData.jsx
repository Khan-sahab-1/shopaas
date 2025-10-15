import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API_URLS} from '../../utils/apiurls';
import makeApiCall from '../../utils/apiHelper';

// Fetch cart data from API
export const fetchCartData = createAsyncThunk(
  'cart/fetchCartData',
  async (_, {rejectWithValue}) => {
    console.log('Fetching cart data...');
    try {
      const response = await makeApiCall(API_URLS.getCart, 'POST', {
        jsonrpc: '2.0',
        params: {recompute_cart_price: true},
      });
      console.log(response, 'RESPONCE');
      if (response?.result?.message === 'Success') {
        const data = response.result.data;

        // Only keep serializable fields
        const cartData = {
          cart_quantity: data.cart_quantity || 0,
          subtotal: data.subtotal || 0,
          sale_order_lines: data.sale_order_lines || {},
          discount: data.discount || 0,
          tax: data.tax || 0,
          delivery_options: data?.delivery_options || [],
          delivery: data?.delivery || 0,
          redeem: data?.redeem || false,
          coupons: data?.coupons || [],
          allowOrderBySnapshot: data?.allowOrderBySnapshot || false,
          hideHomeDeveliery: data?.hideHomeDeveliery || false,
        };

        return cartData;
      } else {
        return rejectWithValue(
          response?.result?.errorMessage || 'Failed to fetch cart',
        );
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartData: {
      cart_quantity: 0,
      subtotal: 0,
      sale_order_lines: {},
    },
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: state => {
      state.cartData = {cart_quantity: 0, subtotal: 0, sale_order_lines: {}};
      state.totalItems = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCartData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = action.payload;
        state.totalItems = action.payload?.cart_quantity || 0;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;
