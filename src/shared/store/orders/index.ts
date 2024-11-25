import { createSlice } from '@reduxjs/toolkit';

import { getOrderOption, getOrdersHistory } from './requests';
import {
  IOrderOption,
  IOrdersHistory,
} from '@/shared/interfaces/order.interface';

interface IOrdersInitialState {
  ordersHistory: IOrdersHistory[];
  orderOption: IOrderOption;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IOrdersInitialState = {
  ordersHistory: [],
  orderOption: {
    delivery_price: 50,
    min_delivery_not_price: 0,
  },
  loading: 'idle',
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(getOrderOption.fulfilled, (state, action) => {
        state.orderOption = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getOrderOption.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getOrderOption.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch account info';
      })

      .addCase(getOrdersHistory.fulfilled, (state, action) => {
        state.ordersHistory = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getOrdersHistory.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getOrdersHistory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch account info';
      });
  },
});

export default ordersSlice;
