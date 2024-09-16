import { createSlice } from '@reduxjs/toolkit'

import { getCities } from './requests'

import ICity from '@/shared/interfaces/city.interface'

interface ICityInitialState {
  selectedCityId: number | null
  cities: ICity[]
}

const initialState: ICityInitialState = {
  selectedCityId: null,
  cities: [],
}

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setSelectedCityId: (state, id) => {
      state.selectedCityId = id.payload
    },
  },
  extraReducers: build => {
    build.addCase(getCities.fulfilled, (state, cities) => {
      if (!state.cities.length) {
        state.cities = cities.payload
      }
    })
  },
})

export default citySlice
