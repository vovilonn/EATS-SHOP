import axios, { AxiosRequestConfig } from 'axios'
import * as cookies from 'cookies-next'

const instanceAxios = axios.create({
  baseURL: 'https://eats.pp.ua/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

instanceAxios.interceptors.request.use(config => {
  const token = cookies.getCookie('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const Axios = async (props: AxiosRequestConfig) => {
  const response = await instanceAxios({
    url: props.url,
    method: props.method,
    data: props.data,
  })

  return response.data
}

export default Axios
