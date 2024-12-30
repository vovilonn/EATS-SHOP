import { Html,Head , Main, NextScript } from 'next/document'
import { FacebookPixelEvents } from "@/shared/components/facebook-pixel";

const Document = () => {
  return (
    <Html lang='en'>
      <Head>
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
