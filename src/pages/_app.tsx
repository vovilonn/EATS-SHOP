import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

import { store } from '@/shared/store'

import '@/shared/assets/styles/globals.scss'
import {FacebookPixelEvents} from "@/shared/components/facebook-pixel";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <FacebookPixelEvents />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App
