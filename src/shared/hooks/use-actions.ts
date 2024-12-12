import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import citySlice from '../store/city';
import authSlice from '../store/auth';
import favoriteSlice from '../store/favorite';
import productSlice from '../store/product';
import adminSlice from '../store/admin';
import cartSlice from '../store/cart';

const actions = {
  ...authSlice.actions,
  ...citySlice.actions,
  ...favoriteSlice.actions,
  ...productSlice.actions,
  ...adminSlice.actions,
  ...cartSlice.actions,
};

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actions, dispatch);
};
