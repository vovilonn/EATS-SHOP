import { Html,Head , Main, NextScript } from 'next/document'
import { FacebookPixelEvents } from "@/shared/components/facebook-pixel";

const Document = () => {
  return (
    <Html lang='en'>
      <Head>
        <title>EATS - доставка їжі Мукачево</title>
        <meta name="description" content="Замовляй піцу, роли, боули та багато іншого! Швидка доставка з 10:00 до 22:00. +380990005758" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
        <meta name="facebook-domain-verification" content="wz3yhfxrby0lq81p2w75pwvg5jmzux" />
        <FacebookPixelEvents />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
