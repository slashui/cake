/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    _next_intl_trailing_slash: '1'
  },
  swcMinify: false,
  experimental: {
    swcPlugins: []
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'ignore-loader'
    });
    return config;
  }
};

const withNextIntl = require("next-intl/plugin")("libs/i18n/i18n.js");
const withVideo = require('next-videos');

module.exports = withVideo(withNextIntl(nextConfig));