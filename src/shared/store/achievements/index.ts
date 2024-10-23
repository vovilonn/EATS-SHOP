import { IAchievement } from '@/shared/interfaces/achievements.interface';
import { createSlice } from '@reduxjs/toolkit';
import { getAllAchievements } from './requests';

interface IAchievementsInitialState {
  achievements: IAchievement[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IAchievementsInitialState = {
  achievements: [],
  loading: 'idle',
  error: null,
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(getAllAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(getAllAchievements.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getAllAchievements.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch account info';
      });
  },
});

export default achievementsSlice;
