import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth';
import citySlice from './city';
import favoriteSlice from './favorite';
import cartSlice from './cart';
import productSlice from './product';
import accountInfoSlice from './account';
import ordersSlice from './orders';
import walletSlice from './wallet';
import brandSlice from './brand';
import authAdminSlice from './admin';
import referallsSlice from './referrals';
import achievementsSlice from './achievements';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [citySlice.name]: citySlice.reducer,
    [favoriteSlice.name]: favoriteSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
    [productSlice.name]: productSlice.reducer,
    [accountInfoSlice.name]: accountInfoSlice.reducer,
    [ordersSlice.name]: ordersSlice.reducer,
    [walletSlice.name]: walletSlice.reducer,
    [brandSlice.name]: brandSlice.reducer,
    [authAdminSlice.name]: authAdminSlice.reducer,
    [referallsSlice.name]: referallsSlice.reducer,
    [achievementsSlice.name]: achievementsSlice.reducer,
  },
});

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
