import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth';
import citySlice from './city';
import favoriteSlice from './favorite';
import cartSlice from './cart';
import productSlice from './product';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [citySlice.name]: citySlice.reducer,
    [favoriteSlice.name]: favoriteSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
    [productSlice.name]: productSlice.reducer,
  },
});

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
