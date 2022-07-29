/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    SERVER_HOST: "https://blog-sh4f.onrender.com",
    // SERVER_HOST: "https://localhost:3001",
  },
};

module.exports = nextConfig;
