import { createSlice } from '@reduxjs/toolkit';
import { getAccountInfo, updateAccountInfo } from './requests';
import IAccountInfo from '@/shared/interfaces/accountInfo.interface';

interface IAccountInfoInitialState {
  accountInfo: IAccountInfo | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IAccountInfoInitialState = {
  accountInfo: null,
  loading: 'idle',
  error: null,
};

const accountInfoSlice = createSlice({
  name: 'accountInfo',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAccountInfo.fulfilled, (state, action) => {
        state.accountInfo = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getAccountInfo.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getAccountInfo.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch account info';
      })
      .addCase(updateAccountInfo.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(updateAccountInfo.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(updateAccountInfo.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to update account info';
      });
  },
});

export default accountInfoSlice;
