import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import * as cookies from 'cookies-next';

const instanceAxios: AxiosInstance = axios.create({
  baseURL: 'https://eats.pp.ua/api',
});

instanceAxios.interceptors.request.use((config) => {
  const useLocalStorage = (config as any).useLocalStorage;
  const dontNeedToken = (config as any).dontNeedToken;

  const token = useLocalStorage
    ? localStorage.getItem('authToken')
    : cookies.getCookie('token');

  if (token && !dontNeedToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  useLocalStorage?: boolean;
  dontNeedToken?: boolean;
}

const Axios = async (props: CustomAxiosRequestConfig) => {
  const { useLocalStorage, ...axiosProps } = props;
  const response = await instanceAxios({
    ...axiosProps,
    useLocalStorage,
  } as CustomAxiosRequestConfig);

  return response.data;
};

export default Axios;
