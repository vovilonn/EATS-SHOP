import { createSlice } from '@reduxjs/toolkit';
import IBrand from '@/shared/interfaces/brand.interface';
import { getBrands } from './requests';

interface IBrandInitialState {
  brand_items: IBrand[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IBrandInitialState = {
  brand_items: [],
  loading: 'idle',
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brand_items = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getBrands.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch cart info';
      });
  },
});

export default brandSlice;
