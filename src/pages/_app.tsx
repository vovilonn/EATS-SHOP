import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

import { store } from '@/shared/store'

import '@/shared/assets/styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App
