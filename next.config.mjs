import composePlugins from 'next-compose-plugins'
import svgrPlugin from 'next-plugin-svgr'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's3.eu-north-1.amazonaws.com',
      'images.remotePatterns',
      'iili.io',
    ],
  },
}

const svgrWithConfig = svgrPlugin({
  svgrOptions: {
    icon: true,
  },
})

export default composePlugins([svgrWithConfig], nextConfig)
