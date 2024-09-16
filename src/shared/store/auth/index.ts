import { createSlice } from '@reduxjs/toolkit'
import * as cookies from 'cookies-next'

import { fillingProfile, login, sendNumberCode } from './requests'

interface IInitialState {
  token: string | null
  isAuth: boolean
  needAuth: boolean
}

const initialState: IInitialState = {
  token: cookies.getCookie('token') || null,
  isAuth: Boolean(cookies.getCookie('token')),
  needAuth: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNeedAuth: (state, value) => {
      state.needAuth = value.payload
    },
  },
  extraReducers: build => {
    build.addCase(sendNumberCode.fulfilled, () => {})
    build.addCase(login.fulfilled, (state, response) => {
      const token = response.payload.data.token
      cookies.setCookie('token', token)

      state.token = token
      state.isAuth = Boolean(token)
    })
    build.addCase(fillingProfile.fulfilled, state => {
      state.needAuth = false
    })
  },
})

export default authSlice
