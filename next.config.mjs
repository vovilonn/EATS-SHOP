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
};

// Конфигурация для SVGR плагина
const svgrWithConfig = svgrPlugin({
  svgrOptions: {
    icon: true,
  },
});

// Добавляем транспиляцию модулей для @ant-design/icons и других
const transpileModules = withTM(['antd', 'rc-util', '@ant-design/icons', 'rc-pagination', 'rc-picker']);

// Экспортируем скомбинированные плагины
export default withPlugins(
  [svgrWithConfig, transpileModules], // Транспиляция и SVGR плагины
  nextConfig
);
