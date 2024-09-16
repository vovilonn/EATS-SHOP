import { createSlice } from '@reduxjs/toolkit'

import IProduct from '@/shared/interfaces/product.interface'

import { addToFavorite, getFavorites } from './requests'

interface IFavoriteInitialState {
  products: IProduct[]
}

const initialState: IFavoriteInitialState = {
  products: [],
}

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    removeProduct: (state, productId) => {
      state.products = state.products.filter(product => {
        return product.id !== productId.payload
      })
    },
  },
  extraReducers: build => {
    build.addCase(addToFavorite.fulfilled, (state, response) => {})
    build.addCase(getFavorites.fulfilled, (state, products) => {
      state.products = products.payload
    })
  },
})

export default favoriteSlice
