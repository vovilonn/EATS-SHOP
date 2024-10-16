import { IReferall } from '@/shared/interfaces/referalls.interface';
import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getMyReferalls = createAsyncThunk<IReferall[]>(
  'referalls/all',
  async () => {
    return (await Axios({ method: 'get', url: '/referral/my' })).data;
  }
);
