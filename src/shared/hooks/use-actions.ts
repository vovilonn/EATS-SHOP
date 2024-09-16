import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import citySlice from '../store/city'
import authSlice from '../store/auth'
import favoriteSlice from '../store/favorite'

const actions = {
  ...authSlice.actions,
  ...citySlice.actions,
  ...favoriteSlice.actions,
}

export const useActions = () => {
  const dispatch = useDispatch()

  return bindActionCreators(actions, dispatch)
}
