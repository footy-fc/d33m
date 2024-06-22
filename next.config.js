/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }, 
    ],
  },
};
const withFonts = require("next-fonts");

module.exports = withFonts();
webpack: (config) => {
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
    ],
  });

  return config;
},

module.exports = nextConfig;
