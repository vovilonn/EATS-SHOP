import { createSlice } from '@reduxjs/toolkit';

import { IWallet } from '@/shared/interfaces/wallet.interface';
import { createReplenishment, getHistoryReplenishment } from './requests';

interface IWalletInitialState {
  replenishments: IWallet[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IWalletInitialState = {
  replenishments: [],
  loading: 'idle',
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createReplenishment.fulfilled, (state, action) => {
        const replenishmentId = action.payload.id;
        const replenishment = state.replenishments.find(
          (item) => item.id === replenishmentId
        );

        if (!replenishment) {
          state.replenishments.push(action.payload);
        }

        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(createReplenishment.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(createReplenishment.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch cart info';
      })

      .addCase(getHistoryReplenishment.fulfilled, (state, action) => {
        state.replenishments = action.payload;

        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getHistoryReplenishment.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getHistoryReplenishment.rejected, (state, action) => {
        state.loading = 'failed';
        state.error =
          action.error.message || 'Failed to fetch replenishment history!';
      });
  },
});

export default walletSlice;
