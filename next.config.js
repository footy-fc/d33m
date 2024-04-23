/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.stamp.fyi",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname:  "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname:  "i.seadn.io",
      },
      {
        protocol: "https",
        hostname:  "i.imgur.com",
      },
      {
        protocol: "https",
        hostname:  "openseauserdata.com",
      },
      { protocol: "https",
       hostname: "a.espncdn.com",
      },
      { protocol: "https",
        hostname: "ipfs.decentralized-content.com",
      },
      { protocol: "https",
        hostname: "imagedelivery.net",
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
