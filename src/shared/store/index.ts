import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth';
import citySlice from './city';
import favoriteSlice from './favorite';
import accountInfoSlice from './account';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [citySlice.name]: citySlice.reducer,
    [favoriteSlice.name]: favoriteSlice.reducer,
    [accountInfoSlice.name]: accountInfoSlice.reducer,
  },
});

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
