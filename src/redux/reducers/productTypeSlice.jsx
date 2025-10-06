import { createSlice } from '@reduxjs/toolkit';

const productTypeSlice = createSlice({
  name: 'productType',
  initialState: {
    selectedType: null,
  },
  reducers: {
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
  },
});

export const { setSelectedType } = productTypeSlice.actions;
export default productTypeSlice.reducer;
