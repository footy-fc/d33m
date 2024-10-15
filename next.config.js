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
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

module.exports = withFonts(), withPWA();
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
