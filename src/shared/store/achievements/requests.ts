import { IAchievement } from '@/shared/interfaces/achievements.interface';
import Axios from '@/shared/utils/axios.utility';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllAchievements = createAsyncThunk<IAchievement[]>(
  'achievements/all',
  async () => {
    return (await Axios({ method: 'get', url: '/achievements/view' })).data;
  }
);
