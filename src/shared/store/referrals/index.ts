import { IReferall } from '@/shared/interfaces/referalls.interface';
import { createSlice } from '@reduxjs/toolkit';
import { getMyReferalls } from './requests';

interface IReferallsInitialState {
  referalls: IReferall[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IReferallsInitialState = {
  referalls: [],
  loading: 'idle',
  error: null,
};

const referallsSlice = createSlice({
  name: 'referalls',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(getMyReferalls.fulfilled, (state, action) => {
        state.referalls = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getMyReferalls.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getMyReferalls.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch account info';
      });
  },
});

export default referallsSlice;
