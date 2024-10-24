import withTM from 'next-transpile-modules';
import withPlugins from 'next-compose-plugins';
import svgrPlugin from 'next-plugin-svgr';

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
  webpack: (config) => {
    config.module.rules.push({
      test: /rc-tree/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
};

const svgrWithConfig = svgrPlugin({
  svgrOptions: {
    icon: true,
  },
});

const transpileModules = withTM([
  'antd',
  'rc-util',
  '@ant-design/icons',
  'rc-pagination',
  'rc-picker',
  'rc-tree',
  'rc-table',
]);

export default withPlugins([svgrWithConfig, transpileModules], nextConfig);
