import Axios from '@/shared/utils/axios.utility'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface ISendNumberCodeProps {
  numberPhone: string
}

interface ILoginProps {
  numberPhone: string
  code: number
}

interface IFillingProfileProps {
  name: string
  referralCode: number | null
  cityId: number
}

export const sendNumberCode = createAsyncThunk(
  'auth/sendNumberCode',
  (props: ISendNumberCodeProps) => {
    return Axios({
      url: '/auth/send_number_code',
      method: 'post',
      data: { number: props.numberPhone },
    })
  }
)

export const login = createAsyncThunk('auth/login', (props: ILoginProps) => {
  return Axios({
    url: '/auth/login',
    method: 'post',
    data: { number: props.numberPhone, code: props.code },
  })
})

export const fillingProfile = createAsyncThunk(
  'auth/fillingProfile',
  (props: IFillingProfileProps) => {
    return Axios({
      url: '/auth/filling_profile',
      method: 'post',
      data: {
        name: props.name,
        city_id: props.cityId,
        referral_code: props.referralCode,
      },
    })
  }
)
